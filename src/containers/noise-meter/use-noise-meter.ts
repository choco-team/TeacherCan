'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  GRAPH_MIN_DB,
  HISTORY_SAMPLE_MS,
  NOISE_HISTORY_LIMIT,
  NoiseSample,
  rmsToDecibel,
  smoothDecibel,
} from './noise-level';

type MeterStatus = 'idle' | 'measuring' | 'error';

type AudioSession = {
  context: AudioContext;
  stream: MediaStream;
  rafId: number;
};

function getMicErrorMessage(error: unknown): string {
  if (error instanceof DOMException) {
    if (
      error.name === 'NotAllowedError' ||
      error.name === 'PermissionDeniedError'
    ) {
      return '마이크 권한이 거부되었습니다. 브라우저에서 마이크를 허용한 뒤 다시 시도해 주세요.';
    }

    if (
      error.name === 'NotFoundError' ||
      error.name === 'DevicesNotFoundError'
    ) {
      return '사용할 수 있는 마이크가 없습니다.';
    }
  }

  return '마이크를 열지 못했습니다. 다시 시도해 주세요.';
}

function releaseSession(session: AudioSession | null) {
  if (!session) return;
  cancelAnimationFrame(session.rafId);
  session.stream.getTracks().forEach((track) => track.stop());
  session.context.close().catch(() => {
    // 이미 닫힌 오디오 컨텍스트는 다시 닫지 않아도 된다.
  });
}

const A_WEIGHT_GAIN = 10 ** (2 / 20);
const ALARM_NOTCHES = [880, 932, 2640, 2796, 4400, 4660];

function createFirstOrderHighpass(context: AudioContext, frequency: number) {
  const { sampleRate } = context;
  const analog = 2 * sampleRate * Math.tan((Math.PI * frequency) / sampleRate);
  const normalizer = analog + 2 * sampleRate;

  return context.createIIRFilter(
    [(2 * sampleRate) / normalizer, (-2 * sampleRate) / normalizer],
    [1, (analog - 2 * sampleRate) / normalizer],
  );
}

/** 1kHz를 0dB로 맞춘 A가중 필터. 소음계의 dB(A)와 같은 곡선이다. */
function connectAWeighting(context: AudioContext, source: AudioNode) {
  const lowRumble = context.createBiquadFilter();
  lowRumble.type = 'highpass';
  lowRumble.frequency.value = 20.598997;
  lowRumble.Q.value = 0.5;

  const low = createFirstOrderHighpass(context, 107.65265);
  const mid = createFirstOrderHighpass(context, 737.86223);

  const high = context.createBiquadFilter();
  high.type = 'lowpass';
  high.frequency.value = 12194.217;
  high.Q.value = 0.5;

  const gain = context.createGain();
  gain.gain.value = A_WEIGHT_GAIN;

  source.connect(lowRumble);
  lowRumble.connect(low);
  low.connect(mid);
  mid.connect(high);
  high.connect(gain);

  return ALARM_NOTCHES.reduce<AudioNode>((node, frequency) => {
    const notch = context.createBiquadFilter();
    notch.type = 'notch';
    notch.frequency.value = frequency;
    notch.Q.value = 18;
    node.connect(notch);
    return notch;
  }, gain);
}

function closeContext(context: AudioContext) {
  context.close().catch(() => {
    // 측정을 시작하기 전에 중단되면 컨텍스트만 닫는다.
  });
}

function isUnreliableInput(label: string) {
  return /bluetooth|virtual|speaker/i.test(label);
}

function findBuiltInDevice(devices: MediaDeviceInfo[]) {
  return devices.find(
    (device) =>
      device.kind === 'audioinput' &&
      device.deviceId !== 'default' &&
      device.deviceId !== 'communications' &&
      /built-in|내장/i.test(device.label),
  );
}

async function openMicrophone(deviceId: string) {
  const audio: MediaTrackConstraints = {
    echoCancellation: false,
    noiseSuppression: false,
    autoGainControl: false,
  };

  if (deviceId && deviceId !== 'default') {
    audio.deviceId = { exact: deviceId };
  }

  try {
    return await navigator.mediaDevices.getUserMedia({ audio });
  } catch (error) {
    // 기기가 가공 옵션을 거절하면 같은 마이크로 다시 연다.
    if (
      error instanceof DOMException &&
      (error.name === 'OverconstrainedError' ||
        error.name === 'ConstraintNotSatisfiedError' ||
        error.name === 'NotFoundError')
    ) {
      const fallback: boolean | MediaTrackConstraints =
        deviceId && deviceId !== 'default'
          ? { deviceId: { exact: deviceId } }
          : true;

      return navigator.mediaDevices.getUserMedia({ audio: fallback });
    }

    throw error;
  }
}

export function useNoiseMeter(
  deviceId: string,
  onDeviceChange: (deviceId: string) => void,
) {
  const [status, setStatus] = useState<MeterStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [level, setLevel] = useState(0);
  const [history, setHistory] = useState<NoiseSample[]>([]);
  const [inputLabel, setInputLabel] = useState('');

  const deviceIdRef = useRef(deviceId);
  deviceIdRef.current = deviceId;
  const onDeviceChangeRef = useRef(onDeviceChange);
  onDeviceChangeRef.current = onDeviceChange;

  const sessionRef = useRef<AudioSession | null>(null);
  const requestIdRef = useRef(0);

  const stop = useCallback(() => {
    requestIdRef.current += 1;
    releaseSession(sessionRef.current);
    sessionRef.current = null;
    setIsStarting(false);
    setStatus('idle');
    setLevel(0);
    setHistory([]);
    setInputLabel('');
  }, []);

  const start = useCallback(async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    releaseSession(sessionRef.current);
    sessionRef.current = null;
    setErrorMessage(null);
    setLevel(0);
    setHistory([]);

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('error');
      setErrorMessage(
        '마이크는 HTTPS 또는 localhost에서만 사용할 수 있습니다.',
      );
      return;
    }

    // 클릭과 같은 순간에 만들어야 브라우저가 오디오를 다시 잠그지 않는다.
    const context = new AudioContext();
    const resumePromise = context.resume();
    setIsStarting(true);

    try {
      let stream = await openMicrophone(deviceIdRef.current);
      const openedLabel = stream.getAudioTracks()[0]?.label ?? '';
      const usingDefault =
        !deviceIdRef.current || deviceIdRef.current === 'default';

      if (usingDefault && isUnreliableInput(openedLabel)) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const builtIn = findBuiltInDevice(devices);

        if (builtIn && requestIdRef.current === requestId) {
          stream.getTracks().forEach((track) => track.stop());
          stream = await openMicrophone(builtIn.deviceId);
          onDeviceChangeRef.current(builtIn.deviceId);
        }
      }

      if (requestIdRef.current !== requestId) {
        stream.getTracks().forEach((track) => track.stop());
        closeContext(context);
        return;
      }

      setInputLabel(stream.getAudioTracks()[0]?.label ?? '');

      await resumePromise;

      if (requestIdRef.current !== requestId) {
        stream.getTracks().forEach((track) => track.stop());
        closeContext(context);
        return;
      }

      const source = context.createMediaStreamSource(stream);
      const weighted = connectAWeighting(context, source);
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;
      weighted.connect(analyser);

      // 출력을 들리지 않게 연결해야 분석기가 무음 값에 고정되지 않는다.
      const silentOutput = context.createGain();
      silentOutput.gain.value = 0;
      analyser.connect(silentOutput);
      silentOutput.connect(context.destination);

      const samples = new Float32Array(analyser.fftSize);
      let smoothed = GRAPH_MIN_DB;
      let lastSampleAt = 0;
      let sampleId = 0;
      const historyBuffer: NoiseSample[] = [];

      const tick = (now: number) => {
        if (requestIdRef.current !== requestId) return;

        const session = sessionRef.current;

        analyser.getFloatTimeDomainData(samples);
        let sum = 0;
        for (let index = 0; index < samples.length; index += 1) {
          const sample = samples[index];
          sum += sample * sample;
        }
        smoothed = smoothDecibel(
          smoothed,
          rmsToDecibel(Math.sqrt(sum / samples.length)),
        );

        if (now - lastSampleAt >= HISTORY_SAMPLE_MS) {
          lastSampleAt = now;
          const displayLevel = Math.round(smoothed);
          sampleId += 1;
          historyBuffer.push({ id: sampleId, value: displayLevel });
          if (historyBuffer.length > NOISE_HISTORY_LIMIT) {
            historyBuffer.shift();
          }
          setLevel(displayLevel);
          setHistory(historyBuffer.slice());
        }

        if (session && requestIdRef.current === requestId) {
          session.rafId = requestAnimationFrame(tick);
        }
      };

      const session: AudioSession = { context, stream, rafId: 0 };
      sessionRef.current = session;
      session.rafId = requestAnimationFrame(tick);
      setStatus('measuring');
    } catch (error) {
      if (requestIdRef.current !== requestId) return;
      releaseSession(sessionRef.current);
      sessionRef.current = null;
      closeContext(context);
      setStatus('error');
      setErrorMessage(getMicErrorMessage(error));
    } finally {
      if (requestIdRef.current === requestId) {
        setIsStarting(false);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      requestIdRef.current += 1;
      releaseSession(sessionRef.current);
      sessionRef.current = null;
    };
  }, []);

  return {
    status,
    errorMessage,
    isStarting,
    level,
    history,
    inputLabel,
    start,
    stop,
  };
}

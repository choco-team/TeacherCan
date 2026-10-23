'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  HISTORY_SAMPLE_MS,
  NOISE_HISTORY_LIMIT,
  NoiseStage,
  NoiseSample,
  clampLevel,
  levelToStage,
  rmsToLevel,
  smoothLevel,
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

export function useNoiseMeter(sensitivity: number) {
  const [status, setStatus] = useState<MeterStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [level, setLevel] = useState(0);
  const [history, setHistory] = useState<NoiseSample[]>([]);

  const sensitivityRef = useRef(sensitivity);
  sensitivityRef.current = sensitivity;

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

    setIsStarting(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      if (requestIdRef.current !== requestId) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      const context = new AudioContext();
      if (context.state === 'suspended') {
        await context.resume();
      }

      if (requestIdRef.current !== requestId) {
        stream.getTracks().forEach((track) => track.stop());
        context.close().catch(() => {
          // 측정을 시작하기 전에 중단되면 컨텍스트만 닫는다.
        });
        return;
      }

      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      const samples = new Uint8Array(analyser.fftSize);
      let smoothed = 0;
      let lastSampleAt = 0;
      let sampleId = 0;
      const historyBuffer: NoiseSample[] = [];

      const tick = (now: number) => {
        if (requestIdRef.current !== requestId) return;

        analyser.getByteTimeDomainData(samples);
        let sum = 0;
        for (let index = 0; index < samples.length; index += 1) {
          const sample = (samples[index] - 128) / 128;
          sum += sample * sample;
        }
        const rms = Math.sqrt(sum / samples.length);
        smoothed = smoothLevel(
          smoothed,
          rmsToLevel(rms, sensitivityRef.current),
        );

        if (now - lastSampleAt >= HISTORY_SAMPLE_MS) {
          lastSampleAt = now;
          const displayLevel = clampLevel(smoothed);
          sampleId += 1;
          historyBuffer.push({ id: sampleId, value: displayLevel });
          if (historyBuffer.length > NOISE_HISTORY_LIMIT) {
            historyBuffer.shift();
          }
          setLevel(displayLevel);
          setHistory(historyBuffer.slice());
        }

        const session = sessionRef.current;
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

  const stage: NoiseStage = levelToStage(level);

  return {
    status,
    errorMessage,
    isStarting,
    level,
    history,
    stage,
    start,
    stop,
  };
}

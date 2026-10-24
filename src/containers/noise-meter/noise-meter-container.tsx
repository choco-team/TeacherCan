'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/button';
import useLocalStorage from '@/hooks/useLocalStorage';
import { decibelToStage, playsWarningSound } from './noise-level';
import NoiseMeterGraph from './noise-meter-graph';
import { useNoiseMeter } from './use-noise-meter';
import { useWarningSound } from './use-warning-sound';

function deviceOptionLabel(device: MediaDeviceInfo) {
  if (device.label) return device.label;
  if (device.deviceId === 'default') return '기본 마이크';
  return '마이크';
}

function MicrophoneControl({
  devices,
  deviceId,
  onChange,
}: {
  devices: MediaDeviceInfo[];
  deviceId: string;
  onChange: (deviceId: string) => void;
}) {
  if (devices.length === 0) return null;

  const selected = devices.some((device) => device.deviceId === deviceId)
    ? deviceId
    : 'default';

  return (
    <label className="flex w-full max-w-md flex-col gap-2 text-left text-sm text-text-subtitle">
      마이크
      <select
        className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm text-text-title dark:border-zinc-800 dark:bg-zinc-950"
        value={selected}
        onChange={(event) => onChange(event.target.value)}
      >
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {deviceOptionLabel(device)}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function NoiseMeterContainer() {
  const [storedDeviceId, setStoredDeviceId] = useLocalStorage(
    'noise-meter-device-id',
    '',
  );
  const deviceId = typeof storedDeviceId === 'string' ? storedDeviceId : '';
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const skipDeviceRestartRef = useRef(false);
  const statusRef = useRef<'idle' | 'measuring' | 'error'>('idle');

  const rememberDevice = useCallback(
    (nextDeviceId: string) => {
      skipDeviceRestartRef.current = true;
      setStoredDeviceId(nextDeviceId);
    },
    [setStoredDeviceId],
  );
  const {
    status,
    errorMessage,
    isStarting,
    level,
    history,
    inputLabel,
    start,
    stop,
  } = useNoiseMeter(deviceId, rememberDevice);
  const stage = decibelToStage(level);
  const { unlockWarningSound } = useWarningSound(
    status === 'measuring' && playsWarningSound(stage),
  );

  statusRef.current = status;

  const refreshDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    const allDevices = await navigator.mediaDevices.enumerateDevices();
    setDevices(
      allDevices.filter(
        (device) =>
          device.kind === 'audioinput' && device.deviceId !== 'communications',
      ),
    );
  }, []);

  useEffect(() => {
    refreshDevices().catch(() => {
      // 권한 전에는 목록이 비어 있을 수 있다.
    });
  }, [refreshDevices]);

  useEffect(() => {
    if (status === 'measuring') {
      refreshDevices().catch(() => {
        // 측정 중 목록 갱신 실패는 화면 동작을 막지 않는다.
      });
    }
  }, [refreshDevices, status]);

  useEffect(() => {
    if (skipDeviceRestartRef.current) {
      skipDeviceRestartRef.current = false;
      return;
    }

    if (statusRef.current === 'measuring') {
      start().catch(() => {
        // 오류 문구는 훅이 표시한다.
      });
    }
  }, [deviceId, start]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 min-h-[calc(100dvh-8rem)]">
      {status === 'measuring' ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <NoiseMeterGraph history={history} decibel={level} />
          <div className="flex w-full flex-col items-center gap-6">
            <MicrophoneControl
              devices={devices}
              deviceId={deviceId}
              onChange={setStoredDeviceId}
            />
            {inputLabel ? (
              <p className="text-xs text-text-subtitle">{inputLabel}</p>
            ) : null}
            <Button variant="gray-outline" size="lg" onClick={stop}>
              측정 중지
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold text-text-title md:text-5xl">
              소음 측정기
            </h1>
            <p className="text-base text-text-subtitle md:text-lg">
              마이크 소리를 dB로 보여 줍니다. 100dB, 해로움부터 경고음이
              울립니다.
            </p>
          </div>
          {errorMessage ? (
            <p className="max-w-md text-sm text-red-500" role="alert">
              {errorMessage}
            </p>
          ) : null}
          <Button
            size="lg"
            onClick={() => {
              unlockWarningSound();
              start();
            }}
            isPending={isStarting}
          >
            {errorMessage ? '다시 시도' : '측정 시작'}
          </Button>
          <MicrophoneControl
            devices={devices}
            deviceId={deviceId}
            onChange={setStoredDeviceId}
          />
        </div>
      )}
    </div>
  );
}

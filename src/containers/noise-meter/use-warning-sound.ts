'use client';

import { useCallback, useEffect, useRef } from 'react';

const ALARM_FREQUENCIES = [880, 932];
const ALARM_GAIN = 0.38;

function startContinuousAlarm(context: AudioContext) {
  const master = context.createGain();
  master.gain.value = ALARM_GAIN;
  master.connect(context.destination);

  const oscillators = ALARM_FREQUENCIES.map((frequency) => {
    const oscillator = context.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.value = frequency;
    oscillator.connect(master);
    oscillator.start();
    return oscillator;
  });

  return () => {
    if (context.state === 'closed') return;

    const now = context.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(ALARM_GAIN, now);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
    oscillators.forEach((oscillator) => {
      oscillator.stop(now + 0.02);
    });
    window.setTimeout(() => {
      if (context.state === 'closed') return;
      master.disconnect();
    }, 40);
  };
}

export function useWarningSound(active: boolean) {
  const contextRef = useRef<AudioContext | null>(null);

  const unlockWarningSound = useCallback(() => {
    const context = contextRef.current ?? new AudioContext();
    contextRef.current = context;
    context.resume().catch(() => {
      // 자동 재생이 막히면 다음 측정 시작에서 다시 연다.
    });
  }, []);

  useEffect(() => {
    if (!active) return undefined;

    const context = contextRef.current;
    if (!context) return undefined;

    context.resume().catch(() => {
      // 재생이 막히면 경고음 없이 측정만 계속한다.
    });
    const stopAlarm = startContinuousAlarm(context);

    return () => {
      stopAlarm();
    };
  }, [active]);

  useEffect(() => {
    return () => {
      contextRef.current?.close().catch(() => {
        // 페이지를 벗어날 때 이미 닫힌 컨텍스트는 무시한다.
      });
      contextRef.current = null;
    };
  }, []);

  return { unlockWarningSound };
}

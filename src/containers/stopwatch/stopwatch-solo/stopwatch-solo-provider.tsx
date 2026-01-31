'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { LapRecord } from '../stopwatch-type';
import { createId } from '../stopwatch-utils';

type SoloStopwatchState = {
  time: number; // milliseconds
  isRunning: boolean;
  isPaused: boolean;
  laps: LapRecord[];
  fastestLap: LapRecord | null;
  slowestLap: LapRecord | null;
};

type SoloStopwatchAction = {
  start: () => void;
  pause: () => void;
  reset: () => void;
  lap: () => void;
  deleteLap: (lapId: string) => void;
};

export const SoloStopwatchStateContext =
  createContext<SoloStopwatchState | null>(null);
export const SoloStopwatchActionContext =
  createContext<SoloStopwatchAction | null>(null);

type Props = {
  children: ReactNode;
};

export default function SoloStopwatchProvider({ children }: Props) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [laps, setLaps] = useState<LapRecord[]>([]);
  const [lastLapTime, setLastLapTime] = useState(0);

  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  const fastestLap = useMemo(() => {
    if (laps.length === 0) return null;
    return laps.reduce((fastest, current) =>
      current.lapTime < fastest.lapTime ? current : fastest,
    );
  }, [laps]);

  const slowestLap = useMemo(() => {
    if (laps.length === 0) return null;
    return laps.reduce((slowest, current) =>
      current.lapTime > slowest.lapTime ? current : slowest,
    );
  }, [laps]);

  const updateTime = useCallback(() => {
    if (!isRunning) return;

    const now = Date.now();
    const elapsed = now - startTimeRef.current + pausedTimeRef.current;
    setTime(elapsed);

    animationFrameRef.current = requestAnimationFrame(updateTime);
  }, [isRunning]);

  const start = useCallback(() => {
    if (isRunning) return;

    if (isPaused) {
      // Resume from paused state
      startTimeRef.current = Date.now();
    } else {
      // Start fresh
      startTimeRef.current = Date.now();
      pausedTimeRef.current = 0;
    }

    setIsRunning(true);
    setIsPaused(false);
  }, [isRunning, isPaused]);

  const pause = useCallback(() => {
    if (!isRunning) return;

    pausedTimeRef.current = time;
    setIsRunning(false);
    setIsPaused(true);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [isRunning, time]);

  const reset = useCallback(() => {
    setTime(0);
    setIsRunning(false);
    setIsPaused(false);
    setLaps([]);
    setLastLapTime(0);
    startTimeRef.current = 0;
    pausedTimeRef.current = 0;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const lap = useCallback(() => {
    if (!isRunning && !isPaused) return;

    const currentTime = time;
    const lapTime = currentTime - lastLapTime;

    const newLap: LapRecord = {
      id: createId(),
      time: currentTime,
      lapTime,
    };

    setLaps((prev) => [...prev, newLap]);
    setLastLapTime(currentTime);
  }, [isRunning, isPaused, time, lastLapTime]);

  const deleteLap = useCallback((lapId: string) => {
    setLaps((prev) => prev.filter((l) => l.id !== lapId));
  }, []);

  useEffect(() => {
    if (isRunning) {
      updateTime();
    }
  }, [isRunning, updateTime]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const stateValue = useMemo<SoloStopwatchState>(
    () => ({
      time,
      isRunning,
      isPaused,
      laps,
      fastestLap,
      slowestLap,
    }),
    [time, isRunning, isPaused, laps, fastestLap, slowestLap],
  );

  const actionValue = useMemo<SoloStopwatchAction>(
    () => ({
      start,
      pause,
      reset,
      lap,
      deleteLap,
    }),
    [start, pause, reset, lap, deleteLap],
  );

  return (
    <SoloStopwatchStateContext.Provider value={stateValue}>
      <SoloStopwatchActionContext.Provider value={actionValue}>
        {children}
      </SoloStopwatchActionContext.Provider>
    </SoloStopwatchStateContext.Provider>
  );
}

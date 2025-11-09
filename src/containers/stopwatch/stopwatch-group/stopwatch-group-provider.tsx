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
import useLocalStorage from '@/hooks/useLocalStorage';
import { GroupTimer, SavedStopwatchGroup, GroupSetup } from '../stopwatch-type';
import { createId, TIMER_COLORS } from '../stopwatch-utils';

type GroupStopwatchState = {
  timers: GroupTimer[];
  isAllRunning: boolean;
  isAllPaused: boolean;
  savedGroups: SavedStopwatchGroup[] | null;
};

type GroupStopwatchAction = {
  startAll: () => void;
  pauseAll: () => void;
  resetAll: () => void;
  startTimer: (timerId: string) => void;
  pauseTimer: (timerId: string) => void;
  resetTimer: (timerId: string) => void;
  createGroup: (setup: GroupSetup) => void;
  loadGroup: (groupId: string) => void;
  deleteGroup: (groupId: string) => void;
  deleteGroups: (groupIds: string[]) => void;
  clearCurrentGroup: () => void;
};

export const GroupStopwatchStateContext =
  createContext<GroupStopwatchState | null>(null);
export const GroupStopwatchActionContext =
  createContext<GroupStopwatchAction | null>(null);

type Props = {
  children: ReactNode;
};

export default function GroupStopwatchProvider({ children }: Props) {
  const [timers, setTimers] = useState<GroupTimer[]>([]);
  const [savedGroups, setSavedGroups] = useLocalStorage<
    SavedStopwatchGroup[] | null
  >('stopwatch-data', null);
  // 로딩 상태는 구조 분해에서 제외 (provider 내부에서 처리)

  const animationFrameRefs = useRef<Map<string, number>>(new Map());
  // 각 타이머의 시작 시간을 저장 (타이머가 시작될 때의 타임스탬프)
  const startTimeRefs = useRef<Map<string, number>>(new Map());
  // 각 타이머의 마지막 업데이트 시점의 누적 시간 저장
  const lastUpdateTimeRefs = useRef<Map<string, number>>(new Map());

  const isAllRunning = useMemo(
    () => timers.length > 0 && timers.every((timer) => timer.isRunning),
    [timers],
  );

  const isAllPaused = useMemo(
    () => timers.length > 0 && timers.every((timer) => !timer.isRunning),
    [timers],
  );

  const updateTimer = useCallback((timerId: string) => {
    const now = performance.now();
    const startTime = startTimeRefs.current.get(timerId);
    const lastUpdateTime = lastUpdateTimeRefs.current.get(timerId) ?? 0;

    if (!startTime) return;

    // 실제 경과 시간 계산 (현재 시간 - 시작 시간)
    const elapsed = now - startTime;
    // 타이머의 기존 누적 시간 + 경과 시간
    const newTime = lastUpdateTime + elapsed;

    setTimers((prev) =>
      prev.map((timer) => {
        if (timer.id === timerId && timer.isRunning) {
          return { ...timer, time: Math.floor(newTime) };
        }
        return timer;
      }),
    );
  }, []);

  const startTimer = useCallback((timerId: string) => {
    const now = performance.now();
    startTimeRefs.current.set(timerId, now);

    setTimers((prev) =>
      prev.map((timer) => {
        if (timer.id === timerId) {
          // 일시정지 상태에서 재개하는 경우, 기존 누적 시간 유지
          const currentTime = timer.time;
          lastUpdateTimeRefs.current.set(timerId, currentTime);
          return { ...timer, isRunning: true, isPaused: false };
        }
        return timer;
      }),
    );
  }, []);

  const pauseTimer = useCallback((timerId: string) => {
    const now = performance.now();
    const startTime = startTimeRefs.current.get(timerId);
    const lastUpdateTime = lastUpdateTimeRefs.current.get(timerId) ?? 0;

    if (startTime) {
      // 일시정지 시점의 누적 시간 계산 및 저장
      const elapsed = now - startTime;
      const currentTime = lastUpdateTime + elapsed;
      lastUpdateTimeRefs.current.set(timerId, currentTime);
      startTimeRefs.current.delete(timerId);
    }

    setTimers((prev) =>
      prev.map((timer) => {
        if (timer.id === timerId) {
          return { ...timer, isRunning: false, isPaused: true };
        }
        return timer;
      }),
    );
  }, []);

  const resetTimer = useCallback((timerId: string) => {
    startTimeRefs.current.delete(timerId);
    lastUpdateTimeRefs.current.set(timerId, 0);

    setTimers((prev) =>
      prev.map((timer) => {
        if (timer.id === timerId) {
          return { ...timer, time: 0, isRunning: false, isPaused: false };
        }
        return timer;
      }),
    );
  }, []);

  const startAll = useCallback(() => {
    const now = performance.now();
    setTimers((prev) =>
      prev.map((timer) => {
        if (!timer.isRunning) {
          startTimeRefs.current.set(timer.id, now);
          lastUpdateTimeRefs.current.set(timer.id, timer.time);
        }
        return {
          ...timer,
          isRunning: true,
          isPaused: false,
        };
      }),
    );
  }, []);

  const pauseAll = useCallback(() => {
    const now = performance.now();
    setTimers((prev) =>
      prev.map((timer) => {
        if (timer.isRunning) {
          const startTime = startTimeRefs.current.get(timer.id);
          const lastUpdateTime = lastUpdateTimeRefs.current.get(timer.id) ?? 0;

          if (startTime) {
            // 일시정지 시점의 누적 시간 계산 및 저장
            const elapsed = now - startTime;
            const currentTime = lastUpdateTime + elapsed;
            lastUpdateTimeRefs.current.set(timer.id, currentTime);
            startTimeRefs.current.delete(timer.id);
          }
        }
        return {
          ...timer,
          isRunning: false,
          isPaused: true,
        };
      }),
    );
  }, []);

  const resetAll = useCallback(() => {
    // 모든 타이머의 시작 시간과 누적 시간 초기화
    setTimers((prev) => {
      prev.forEach((timer) => {
        startTimeRefs.current.delete(timer.id);
        lastUpdateTimeRefs.current.set(timer.id, 0);
      });
      return prev.map((timer) => ({
        ...timer,
        time: 0,
        isRunning: false,
        isPaused: false,
      }));
    });
  }, []);

  const createGroup = useCallback(
    (setup: GroupSetup) => {
      const groupId = createId();
      const newGroup: SavedStopwatchGroup = {
        id: groupId,
        title: setup.title,
        createdAt: new Date().toISOString(),
        timers: setup.timerNames.map((name, index) => ({
          id: createId(),
          name,
          color:
            setup.timerColors[index] ||
            TIMER_COLORS[index % TIMER_COLORS.length],
        })),
      };

      setSavedGroups((prev) => [...(prev || []), newGroup]);

      // 기존 타이머의 ref 정리
      animationFrameRefs.current.forEach((frameId) => {
        cancelAnimationFrame(frameId);
      });
      animationFrameRefs.current.clear();
      startTimeRefs.current.clear();
      lastUpdateTimeRefs.current.clear();

      // Initialize timers
      const initialTimers: GroupTimer[] = newGroup.timers.map((timer) => ({
        ...timer,
        time: 0,
        isRunning: false,
        isPaused: false,
      }));
      setTimers(initialTimers);
    },
    [setSavedGroups],
  );

  const loadGroup = useCallback(
    (groupId: string) => {
      // savedGroups가 null이거나 undefined인 경우 처리
      if (!savedGroups) {
        return;
      }

      const group = savedGroups.find((g) => g.id === groupId);
      if (group) {
        // 기존 타이머의 ref 정리
        animationFrameRefs.current.forEach((frameId) => {
          cancelAnimationFrame(frameId);
        });
        animationFrameRefs.current.clear();
        startTimeRefs.current.clear();
        lastUpdateTimeRefs.current.clear();

        // Initialize timers
        const initialTimers: GroupTimer[] = group.timers.map((timer) => ({
          ...timer,
          time: 0,
          isRunning: false,
          isPaused: false,
        }));
        setTimers(initialTimers);
      }
    },
    [savedGroups],
  );

  const deleteGroup = useCallback(
    (groupId: string) => {
      setSavedGroups((prev) => {
        if (!prev) return [];
        return prev.filter((g) => g.id !== groupId);
      });
    },
    [setSavedGroups],
  );

  const deleteGroups = useCallback(
    (groupIds: string[]) => {
      setSavedGroups((prev) => {
        if (!prev) return [];
        return prev.filter((g) => !groupIds.includes(g.id));
      });
    },
    [setSavedGroups],
  );

  const clearCurrentGroup = useCallback(() => {
    // 모든 타이머의 ref 정리
    animationFrameRefs.current.forEach((frameId) => {
      cancelAnimationFrame(frameId);
    });
    animationFrameRefs.current.clear();
    startTimeRefs.current.clear();
    lastUpdateTimeRefs.current.clear();
    setTimers([]);
  }, []);

  // Animation frame management
  useEffect(() => {
    const runningTimers = timers.filter((timer) => timer.isRunning);
    const refs = animationFrameRefs.current;

    runningTimers.forEach((timer) => {
      if (!refs.has(timer.id)) {
        const update = () => {
          updateTimer(timer.id);
          // startTimeRefs에 있는 경우에만 계속 실행 (실행 중인 타이머)
          if (startTimeRefs.current.has(timer.id)) {
            refs.set(timer.id, requestAnimationFrame(update));
          } else {
            refs.delete(timer.id);
          }
        };
        refs.set(timer.id, requestAnimationFrame(update));
      }
    });

    // Clean up stopped timers
    timers.forEach((timer) => {
      if (!timer.isRunning && refs.has(timer.id)) {
        const frameId = refs.get(timer.id);
        if (frameId) {
          cancelAnimationFrame(frameId);
        }
        refs.delete(timer.id);
      }
    });

    // 삭제된 타이머의 ref 정리
    const currentTimerIds = new Set(timers.map((t) => t.id));
    refs.forEach((frameId, timerId) => {
      if (!currentTimerIds.has(timerId)) {
        cancelAnimationFrame(frameId);
        refs.delete(timerId);
        startTimeRefs.current.delete(timerId);
        lastUpdateTimeRefs.current.delete(timerId);
      }
    });

    return () => {
      refs.forEach((frameId) => {
        if (frameId) cancelAnimationFrame(frameId);
      });
      refs.clear();
    };
  }, [timers, updateTimer]);

  const stateValue = useMemo<GroupStopwatchState>(
    () => ({
      timers,
      isAllRunning,
      isAllPaused,
      savedGroups,
    }),
    [timers, isAllRunning, isAllPaused, savedGroups],
  );

  const actionValue = useMemo<GroupStopwatchAction>(
    () => ({
      startAll,
      pauseAll,
      resetAll,
      startTimer,
      pauseTimer,
      resetTimer,
      createGroup,
      loadGroup,
      deleteGroup,
      deleteGroups,
      clearCurrentGroup,
    }),
    [
      startAll,
      pauseAll,
      resetAll,
      startTimer,
      pauseTimer,
      resetTimer,
      createGroup,
      loadGroup,
      deleteGroup,
      deleteGroups,
      clearCurrentGroup,
    ],
  );

  return (
    <GroupStopwatchStateContext.Provider value={stateValue}>
      <GroupStopwatchActionContext.Provider value={actionValue}>
        {children}
      </GroupStopwatchActionContext.Provider>
    </GroupStopwatchStateContext.Provider>
  );
}

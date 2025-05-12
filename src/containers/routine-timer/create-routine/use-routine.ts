import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Activity, Routine } from './routine-types';

export const useRoutine = (routineId: string) => {
  const [routines, setRoutines] = useLocalStorage<Routine[]>('routines', []);
  const [routine, setRoutine] = useState<Routine>({
    key: routineId,
    title: '새 루틴',
    totalTime: 0,
    activities: [],
  });

  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null,
  );
  const currentActivity =
    routine.activities.find((a) => a.activityKey === selectedActivityId) ||
    null;

  useEffect(() => {
    if (Array.isArray(routines)) {
      const found = routines.find((r) => r.key === routineId);
      if (found) {
        setRoutine(found);
        setSelectedActivityId(found.activities[0]?.activityKey ?? null);
      }
    }
  }, [routineId, routines]);

  useEffect(() => {
    const total = routine.activities.reduce(
      (sum, activity) => sum + activity.time,
      0,
    );
    setRoutine((prev) => ({ ...prev, totalTime: total }));
  }, [routine.activities]);

  const handleActivityChange = (field: 'action', value: string) => {
    if (!selectedActivityId) return;

    const updated = routine.activities.map((activity) =>
      activity.activityKey === selectedActivityId
        ? { ...activity, [field]: value }
        : activity,
    );

    setRoutine({ ...routine, activities: updated });
  };

  const handleAddActivity = () => {
    const newActivity: Activity = {
      activityKey: nanoid(),
      order: routine.activities.length + 1,
      action: '',
      time: 0,
    };
    const updated = [...routine.activities, newActivity];
    setRoutine({ ...routine, activities: updated });
    setSelectedActivityId(newActivity.activityKey);
  };

  const handleRemoveActivity = () => {
    if (!selectedActivityId) return;

    const updated = routine.activities
      .filter((a) => a.activityKey !== selectedActivityId)
      .map((a, i) => ({ ...a, order: i + 1 }));

    setRoutine({ ...routine, activities: updated });
    setSelectedActivityId(updated[0]?.activityKey ?? null);
  };

  const handleUpdateTime = (timeInSeconds: number) => {
    if (!selectedActivityId) return;

    const updated = routine.activities.map((activity) =>
      activity.activityKey === selectedActivityId
        ? { ...activity, time: timeInSeconds }
        : activity,
    );

    setRoutine({ ...routine, activities: updated });
  };

  const handleSelect = (key: string) => {
    setSelectedActivityId(key);
  };

  const updateRoutineTitle = (title: string) => {
    setRoutine({ ...routine, title });
  };

  const saveRoutine = () => {
    const index = routines.findIndex((r) => r.key === routineId);
    if (index !== -1) {
      const updatedRoutines = [...routines];
      updatedRoutines[index] = routine;
      setRoutines(updatedRoutines);
    } else {
      setRoutines([...routines, routine]);
    }
  };
  const formatTime = (timeInSeconds?: number): string => {
    if (timeInSeconds === undefined) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    routine,
    currentActivity,
    selectedActivityId,
    formatTime,
    handleActivityChange,
    handleAddActivity,
    handleRemoveActivity,
    handleUpdateTime,
    handleSelect,
    updateRoutineTitle,
    saveRoutine,
  };
};

import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useRouter } from 'next/navigation';
import { MENU_ROUTE } from '@/constants/route';
import { Activity, Routine } from './routine-types';

export const useRoutine = (routineId: string | null) => {
  const [routine, setRoutine] = useState<Routine>(() => ({
    id: routineId,
    title: '',
    activities: [
      {
        id: nanoid(),
        order: 1,
        action: '',
        time: 0,
      },
    ],
    totalTime: 0,
  }));
  const [routines, setRoutines] = useLocalStorage<Routine[]>('routines', []);

  const router = useRouter();
  const isNew = routineId === null;

  useEffect(() => {
    if (Array.isArray(routines) && !isNew) {
      const found = routines.find((r) => r.id === routineId);
      if (found) setRoutine(found);
    }
  }, [routineId, routines, isNew]);

  // 총 시간 계산
  useEffect(() => {
    const totalTime = routine.activities.reduce(
      (sum, activity) => sum + activity.time,
      0,
    );
    setRoutine((prev) => ({ ...prev, totalTime }));
  }, [routine.activities]);

  const handleChangeActivity = (
    activityId: string,
    field: 'action' | 'time',
    value: string | number,
  ) => {
    const updated = routine.activities.map((activity) =>
      activity.id === activityId ? { ...activity, [field]: value } : activity,
    );

    setRoutine({ ...routine, activities: updated });
  };

  const handleAddActivity = () => {
    if (routine.activities.length >= 10) return;

    const newActivity: Activity = {
      id: nanoid(),
      order: routine.activities.length + 1,
      action: '',
      time: 0,
    };

    setRoutine((prev) => ({
      ...prev,
      activities: [...prev.activities, newActivity],
    }));
  };

  const handleRemoveActivity = (activityId: string) => {
    setRoutine((prev) => {
      const activities = prev.activities
        .filter(({ id }) => id !== activityId)
        .map((activity, i) => ({ ...activity, order: i + 1 }));
      return { ...prev, activities };
    });
  };

  const handleReorderActivities = (newOrder: Activity[]) => {
    const reordered = newOrder.map((activity, index) => ({
      ...activity,
      order: index + 1,
    }));

    setRoutine((prev) => ({ ...prev, activities: reordered }));
  };

  const updateRoutineTitle = (title: string) => {
    setRoutine((prev) => ({ ...prev, title }));
  };

  const saveRoutine = () => {
    if (isNew) {
      setRoutines((prev) => [...prev, { ...routine, id: nanoid() }]);
    } else {
      const index = routines.findIndex(({ id }) => id === routineId);
      if (index > -1) {
        setRoutines((prev) => [
          ...prev.slice(0, index),
          routine,
          ...prev.slice(index + 1),
        ]);
      }
    }

    router.push(`${MENU_ROUTE.ROUTINE_TIMER}/${routineId}`);
  };

  return {
    routine,
    handleChangeActivity,
    handleAddActivity,
    handleRemoveActivity,
    handleReorderActivities,
    updateRoutineTitle,
    saveRoutine,
  };
};

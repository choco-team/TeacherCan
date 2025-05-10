import { useState, useEffect } from 'react';
import { Activity, Routine } from './routine-types';

export const useRoutine = (routineId: string) => {
  const [routine, setRoutine] = useState<Routine>({
    key: routineId,
    title: '새 루틴',
    totalTime: 0,
    activities: [],
  });

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const currentActivity =
    selectedIndex !== null ? routine.activities[selectedIndex] : null;

  useEffect(() => {
    const saved = localStorage.getItem('routines');
    if (saved) {
      const routines: Routine[] = JSON.parse(saved);
      const found = routines.find((r) => r.key === routineId);
      if (found) {
        setRoutine(found);
        setSelectedIndex(0);
      }
    }
  }, [routineId]);

  useEffect(() => {
    const total = routine.activities.reduce(
      (sum, activity) => sum + activity.time,
      0,
    );
    setRoutine((prev) => ({ ...prev, totalTime: total }));
  }, [routine.activities]);

  const handleActivityChange = (field: 'action', value: string) => {
    if (selectedIndex === null) return;

    const updated = [...routine.activities];
    const target = updated[selectedIndex];

    target.action = value;

    setRoutine({ ...routine, activities: updated });
  };

  const handleAddActivity = () => {
    const newActivity: Activity = {
      order: routine.activities.length + 1,
      action: '',
      time: 0,
    };
    const updated = [...routine.activities, newActivity];
    setRoutine({ ...routine, activities: updated });
    setSelectedIndex(updated.length - 1);
  };

  const handleRemoveActivity = () => {
    if (selectedIndex === null) return;

    const updated = routine.activities
      .filter((_, i) => i !== selectedIndex)
      .map((a, i) => ({ ...a, order: i + 1 }));

    setRoutine({ ...routine, activities: updated });
    setSelectedIndex(updated.length > 0 ? 0 : null);
  };

  const handleUpdateTime = (timeInSeconds: number) => {
    if (selectedIndex === null) return;

    const updated = [...routine.activities];
    updated[selectedIndex].time = timeInSeconds;

    setRoutine({ ...routine, activities: updated });
  };

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
  };

  const updateRoutineTitle = (title: string) => {
    setRoutine({ ...routine, title });
  };

  const saveRoutine = () => {
    const saved = localStorage.getItem('routines');
    let routines: Routine[] = [];

    if (saved) {
      routines = JSON.parse(saved);
      const index = routines.findIndex((r) => r.key === routineId);
      if (index !== -1) {
        routines[index] = routine;
      } else {
        routines.push(routine);
      }
    } else {
      routines = [routine];
    }

    localStorage.setItem('routines', JSON.stringify(routines));
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
    selectedIndex,
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

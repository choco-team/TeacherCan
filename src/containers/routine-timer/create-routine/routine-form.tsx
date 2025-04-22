'use client';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

type Activity = {
  order: number;
  action: string;
  time: number;
};

type Routine = {
  key: string;
  title: string;
  totalTime: number;
  routine: Activity[];
};

type RouteParams = {
  params: {
    id: string;
  };
};

export default function RoutineForm({ params }: RouteParams): JSX.Element {
  const routineId = params.id;

  const [routine, setRoutine] = useState<Routine>({
    key: routineId,
    title: '새 루틴',
    totalTime: 0,
    routine: [],
  });

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const currentActivity =
    selectedIndex !== null ? routine.routine[selectedIndex] : null;
  const [isTimeEditing, setIsTimeEditing] = useState(false);
  const [editMinutes, setEditMinutes] = useState('00');
  const [editSeconds, setEditSeconds] = useState('00');

  const formatTime = (timeInSeconds?: number): string => {
    if (timeInSeconds === undefined) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

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
    if (currentActivity) {
      setEditMinutes(
        Math.floor(currentActivity.time / 60)
          .toString()
          .padStart(2, '0'),
      );
      setEditSeconds((currentActivity.time % 60).toString().padStart(2, '0'));
    }
  }, [currentActivity, selectedIndex]);

  const handleActivityChange = (field: 'action', value: string) => {
    if (selectedIndex === null) return;

    const updated = [...routine.routine];
    const target = updated[selectedIndex];

    target.action = value;

    setRoutine({ ...routine, routine: updated });
  };

  const handleTimeChange = () => {
    if (selectedIndex === null) return;

    const minutes = parseInt(editMinutes || '0', 10);
    const seconds = parseInt(editSeconds || '0', 10);
    const timeInSeconds = minutes * 60 + seconds;

    const updated = [...routine.routine];
    updated[selectedIndex].time = timeInSeconds;

    setRoutine({ ...routine, routine: updated });
    setIsTimeEditing(false);
  };

  const handleAddActivity = () => {
    const newActivity: Activity = {
      order: routine.routine.length + 1,
      action: '',
      time: 0,
    };
    const updated = [...routine.routine, newActivity];
    setRoutine({ ...routine, routine: updated });
    setSelectedIndex(updated.length - 1);
  };

  const handleRemoveActivity = () => {
    if (selectedIndex === null) return;

    const updated = routine.routine
      .filter((_, i) => i !== selectedIndex)
      .map((a, i) => ({ ...a, order: i + 1 }));

    setRoutine({ ...routine, routine: updated });
    setSelectedIndex(updated.length > 0 ? 0 : null);
  };

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    setIsTimeEditing(false);
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

    const totalTime = routine.routine.reduce((sum, act) => sum + act.time, 0);
    setRoutine({ ...routine, totalTime });
    localStorage.setItem('routines', JSON.stringify(routines));
  };

  useEffect(() => {
    const total = routine.routine.reduce(
      (sum, activity) => sum + activity.time,
      0,
    );
    setRoutine((prev) => ({ ...prev, totalTime: total }));
  }, [routine.routine]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Input
          type="text"
          value={routine.title}
          onChange={(e) => setRoutine({ ...routine, title: e.target.value })}
          className="text-xl font-bold p-2 w-full bg-gray-100 rounded"
          placeholder="루틴 이름 입력"
        />
        <Button
          onClick={saveRoutine}
          className="ml-4 bg-primary-500 text-white px-4 py-2 rounded"
        >
          저장
        </Button>
      </div>

      <div className="bg-primary-100 rounded-xl p-6 mb-8">
        {currentActivity ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                value={currentActivity.action}
                onChange={(e) => handleActivityChange('action', e.target.value)}
                placeholder="활동명 입력"
                className="text-5xl font-bold text-center w-full bg-transparent border-b-2 border-primary-300 focus:outline-none focus:border-primary-500 px-2"
              />
              <button
                type="button"
                onClick={handleRemoveActivity}
                className="p-1 hover:text-primary-500 rounded-full text-primary-300 ml-2"
                title="삭제"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center">
              {isTimeEditing ? (
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center bg-white rounded-lg p-2 shadow">
                    <input
                      type="number"
                      min={0}
                      value={editMinutes}
                      onChange={(e) => setEditMinutes(e.target.value)}
                      className="w-16 text-4xl text-center border-0 focus:outline-none"
                      placeholder="00"
                    />
                    <span className="text-4xl mx-1">:</span>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={editSeconds}
                      onChange={(e) => setEditSeconds(e.target.value)}
                      className="w-16 text-4xl text-center border-0 focus:outline-none"
                      placeholder="00"
                    />
                    <button
                      type="button"
                      onClick={handleTimeChange}
                      className="ml-2 bg-primary-500 text-white p-2 rounded-md"
                    >
                      적용
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="flex items-center cursor-pointer hover:bg-primary-200 px-6 py-3 rounded-full"
                  onClick={() => setIsTimeEditing(true)}
                >
                  <p className="text-8xl font-bold">
                    {formatTime(currentActivity.time)}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-xl text-gray-500">
              활동을 선택하거나 추가하세요
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-4 flex-wrap items-center justify-center">
        {routine.routine.map((activity, i) => (
          <div
            key={`${routine.key}-${activity.order}`}
            onClick={() => handleSelect(i)}
            className={`w-24 h-20 rounded-xl flex flex-col items-center justify-center text-xs cursor-pointer transition ${
              selectedIndex === i
                ? 'bg-primary-400 font-bold text-white'
                : 'bg-primary-100 text-gray-500'
            }`}
          >
            <div className="text-center truncate w-full px-1">
              {activity.action || `활동 ${i + 1}`}
            </div>
            <div className="mt-1">{formatTime(activity.time)}</div>
          </div>
        ))}

        {/* + 카드 */}
        <div
          onClick={handleAddActivity}
          className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200"
        >
          <span className="text-3xl text-gray-400">+</span>
        </div>
      </div>
    </div>
  );
}

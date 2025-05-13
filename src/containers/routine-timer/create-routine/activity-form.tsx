'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/input';
import { Activity } from './routine-types';

type ActivityFormProps = {
  activity: Activity | null;
  onActivityChange: (field: 'action', value: string) => void;
  onRemove: () => void;
  onTimeChange: (timeInSeconds: number) => void;
};

export function ActivityForm({
  activity,
  onActivityChange,
  onRemove,
  onTimeChange,
}: ActivityFormProps): React.JSX.Element {
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');

  useEffect(() => {
    if (activity) {
      setMinutes(
        Math.floor(activity.time / 60)
          .toString()
          .padStart(2, '0'),
      );
      setSeconds((activity.time % 60).toString().padStart(2, '0'));
    }
  }, [activity]);

  const updateTime = (mins: string, secs: string) => {
    if (!activity) return;

    const minutesValue = parseInt(mins || '0', 10);
    const secondsValue = parseInt(secs || '0', 10);
    const timeInSeconds = minutesValue * 60 + secondsValue;

    onTimeChange(timeInSeconds);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // 숫자만 허용
    const value = rawValue ? parseInt(rawValue, 10).toString() : '';

    const paddedValue = value.padStart(2, '0');
    setMinutes(paddedValue);
    updateTime(paddedValue, seconds);
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const value = rawValue ? parseInt(rawValue, 10).toString() : '';

    let secondsValue = parseInt(value, 10);
    if (secondsValue >= 60) {
      secondsValue = 59;
    }

    const paddedValue = secondsValue.toString().padStart(2, '0');
    setSeconds(paddedValue);
    updateTime(minutes, paddedValue);
  };

  const handleBlur = (field: 'minutes' | 'seconds') => {
    if (field === 'minutes') {
      const paddedMinutes = minutes
        ? parseInt(minutes, 10).toString().padStart(2, '0')
        : '00';
      setMinutes(paddedMinutes);
      updateTime(paddedMinutes, seconds);
    } else {
      const paddedSeconds = seconds
        ? parseInt(seconds, 10).toString().padStart(2, '0')
        : '00';
      setSeconds(paddedSeconds);
      updateTime(minutes, paddedSeconds);
    }
  };

  if (!activity) {
    return (
      <div className="text-center py-8">
        <p className="text-xl text-gray-500">활동을 선택하거나 추가하세요</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={activity.action}
          onChange={(e) => onActivityChange('action', e.target.value)}
          placeholder="활동명 입력"
          className="text-5xl font-bold text-center w-full bg-transparent border-b-2 border-primary-300 focus:outline-none focus:border-primary-500 px-2"
        />
        <button
          type="button"
          onClick={onRemove}
          className="p-1 hover:text-primary-500 rounded-full text-primary-300 ml-2"
          title="삭제"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center p-2">
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={minutes}
            onChange={handleMinutesChange}
            onBlur={() => handleBlur('minutes')}
            className="text-5xl text-center bg-primary-100"
            placeholder="00"
          />
          <span className="text-4xl mx-1">:</span>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={seconds}
            onChange={handleSecondsChange}
            onBlur={() => handleBlur('seconds')}
            className="text-5xl text-center bg-primary-100"
            placeholder="00"
          />
        </div>
      </div>
    </>
  );
}

'use client';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import { ActivityForm } from './activity-form';
import { MusicSelector } from '../background-music/music-selector';
import { useRoutine } from './use-routine';
import { RouteParams } from './routine-types';

export default function RoutineForm({ params }: RouteParams): JSX.Element {
  const router = useRouter();
  const routineId = params.id;

  const {
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
    updateRoutineMusic,
  } = useRoutine(routineId);

  const handleMusicChange = (videoId: string, url?: string) => {
    updateRoutineMusic(videoId, url);
  };

  const handleSaveWithMusic = () => {
    saveRoutine();
  };

  const handleStart = () => {
    handleSaveWithMusic();
    router.push(`/routine-timer/play/${routineId}`);
  };

  const handleRoutineList = () => {
    router.push(`/routine-timer`);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4 mb-2">
          <Input
            type="text"
            value={routine.title}
            onChange={(e) => updateRoutineTitle(e.target.value)}
            className="text-xl font-bold p-2 flex-grow bg-gray-100 rounded"
            placeholder="루틴타이머 이름 입력"
          />
          <div className="bg-primary-100 px-4 py-2 rounded-lg text-primary-700 font-medium flex items-center whitespace-nowrap">
            <Clock className="h-5 w-5 mr-1" />
            {Math.floor(routine.totalTime / 60)}분 {routine.totalTime % 60}초
          </div>
        </div>
        <div className="flex ml-4 gap-2">
          <Button
            onClick={handleRoutineList}
            className="bg-primary-500 text-white px-4 py-2 rounded"
          >
            목록으로 돌아가기
          </Button>
          <Button
            onClick={handleSaveWithMusic}
            className="bg-primary-500 text-white px-4 py-2 rounded"
          >
            저장
          </Button>
          <Button
            onClick={handleStart}
            className="bg-green-500 text-white px-4 py-2 rounded"
            disabled={routine.activities.length === 0}
          >
            저장 후 시작
          </Button>
        </div>
      </div>

      <MusicSelector
        videoId={routine.videoId || ''}
        url={routine.url}
        onMusicChange={handleMusicChange}
      />

      <div className="bg-primary-100 rounded-xl p-6 mb-8">
        <ActivityForm
          activity={currentActivity}
          onActivityChange={handleActivityChange}
          onRemove={handleRemoveActivity}
          onTimeChange={handleUpdateTime}
        />
      </div>

      <div className="flex gap-4 flex-wrap items-center justify-center">
        {routine.activities.map((activity, i) => (
          <div
            key={activity.activityKey}
            onClick={() => handleSelect(activity.activityKey)}
            className={`w-24 h-20 rounded-xl flex flex-col items-center justify-center text-xs cursor-pointer transition ${
              selectedActivityId === activity.activityKey
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

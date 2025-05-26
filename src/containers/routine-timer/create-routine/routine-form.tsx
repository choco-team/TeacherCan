'use client';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Music } from 'lucide-react';
import { ActivityForm } from './activity-form';
import { useRoutine } from './use-routine';
import { RouteParams } from './routine-types';

export default function RoutineForm({ params }: RouteParams): JSX.Element {
  const router = useRouter();
  const routineId = params.id;
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [musicTitle, setMusicTitle] = useState('');
  const [musicVideoId, setMusicVideoId] = useState('');
  const [isLoadingMusic, setIsLoadingMusic] = useState(false);
  const [musicError, setMusicError] = useState('');

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
  } = useRoutine(routineId);

  const extractVideoId = (url: string): string => {
    // 다양한 유튜브 URL 형식 지원
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    const matchResult = patterns.find((pattern) => {
      const match = url.match(pattern);
      return match && match[1];
    });

    if (matchResult) {
      const match = url.match(matchResult);
      return match ? match[1] : '';
    }

    return '';
  };

  const handleYoutubeUrlChange = async (url: string) => {
    setYoutubeUrl(url);
    setMusicError('');

    if (!url.trim()) {
      setMusicTitle('');
      setMusicVideoId('');
      return;
    }

    const videoId = extractVideoId(url);

    if (!videoId) {
      setMusicError('유튜브 동영상 URL을 다시 확인해주세요.');
      return;
    }

    if (videoId === musicVideoId) return;

    setIsLoadingMusic(true);
    try {
      const title = `YouTube Music (${videoId})`;
      setMusicTitle(title);
      setMusicVideoId(videoId);
    } catch (error) {
      console.error('Error getting music title:', error);
      setMusicError('동영상을 찾지 못했어요. 다시 시도해주세요.');
      setMusicTitle('');
      setMusicVideoId('');
    } finally {
      setIsLoadingMusic(false);
    }
  };

  const handleSaveWithMusic = () => {
    // 배경음악 정보는 localStorage에서만 관리하고, routine 객체에는 추가하지 않음
    saveRoutine();
  };

  const handleStart = () => {
    handleSaveWithMusic();
    if (musicVideoId) {
      const musicData = JSON.stringify({
        videoId: musicVideoId,
        title: musicTitle,
      });
      localStorage.setItem(`routine-music-${routineId}`, musicData);
    }
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

      {/* 배경음악 설정 섹션 */}
      <div className="bg-blue-50 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Music className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-800">배경음악 설정</h3>
        </div>

        <div className="space-y-3">
          <Input
            type="text"
            value={youtubeUrl}
            onChange={(e) => handleYoutubeUrlChange(e.target.value)}
            className="w-full p-3 border rounded-lg"
            placeholder="유튜브 동영상 URL을 입력하세요 (예: https://www.youtube.com/watch?v=...)"
          />

          {isLoadingMusic && (
            <div className="text-blue-600 text-sm">
              음악 정보를 불러오는 중...
            </div>
          )}

          {musicError && (
            <div className="text-red-500 text-sm">{musicError}</div>
          )}

          {musicTitle && !isLoadingMusic && (
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  선택된 배경음악:
                </span>
              </div>
              <div className="text-gray-700 mt-1">{musicTitle}</div>
            </div>
          )}
        </div>
      </div>

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

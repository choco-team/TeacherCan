'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Clock, Plus, ListChecks } from 'lucide-react';
import { MENU_ROUTE } from '@/constants/route';
import { Card, CardContent } from '@/components/card';
import { Button } from '@/components/button';
import { Routine } from './create-routine/routine-types';
import { getTotalTime } from './routine-timer.utils';
import { ROUTINES_MAX_COUNT } from './routine-timer.constants';

export default function RoutineTimerList(): JSX.Element {
  const router = useRouter();
  const [routines] = useLocalStorage<Routine[]>('routines', []);

  const handleAddRoutine = (): void => {
    router.push(`${MENU_ROUTE.ROUTINE_TIMER}/new`);
  };

  const handleClickRoutine = (id: string): void => {
    router.push(`${MENU_ROUTE.ROUTINE_TIMER}/${id}`);
  };

  const displayRoutines = Array.isArray(routines) ? routines : [];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) {
      return `${remainingSeconds}초`;
    }
    if (remainingSeconds === 0) {
      return `${minutes}분`;
    }
    return `${minutes}분 ${remainingSeconds}초`;
  };

  return (
    <div className="max-w-screen-md w-full mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          내 루틴 타이머
        </h1>
        <p className="text-gray-600">
          저장된 루틴 {displayRoutines.length}개 / 최대 {ROUTINES_MAX_COUNT}개
        </p>
      </div>

      {displayRoutines.length === 0 ? (
        /* 빈 상태 */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="md:col-span-2 border-2 border-dashed border-gray-300 bg-gray-50/50">
            <CardContent className="text-center py-16">
              <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Clock className="size-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                아직 루틴이 없어요
              </h3>
              <p className="text-gray-600 mb-6">
                반복되는 활동들을 루틴으로 만들어보세요
              </p>
              <Button onClick={handleAddRoutine} className="gap-2">
                <Plus className="size-4" />첫 루틴 만들기
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayRoutines.map(({ id, title, activities }) => {
            const totalTime = getTotalTime(activities);
            return (
              <Card
                key={id}
                onClick={() => handleClickRoutine(id)}
                className="group relative cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.01] border-gray-200"
              >
                <CardContent className="h-full flex flex-col p-8">
                  {/* 제목 */}
                  <h2 className="grow font-bold text-xl text-gray-900 mb-6 leading-snug break-words">
                    {title || '제목 없음'}
                  </h2>

                  {/* 정보 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-base text-gray-600">
                      <div className="size-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <Clock className="size-4 text-primary-600" />
                      </div>
                      <span className="font-medium">
                        {formatTime(totalTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-base text-gray-600">
                      <div className="size-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <ListChecks className="size-4 text-primary-600" />
                      </div>
                      <span className="font-medium">
                        {activities.length}개 활동
                      </span>
                    </div>
                  </div>

                  {/* 하단 액센트 */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg" />
                </CardContent>
              </Card>
            );
          })}

          {/* 새 루틴 추가 카드 */}
          {displayRoutines.length < ROUTINES_MAX_COUNT && (
            <Card
              onClick={handleAddRoutine}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.01] border-2 border-dashed border-gray-300 hover:border-primary-400 bg-gray-50/50 hover:bg-primary-50/50"
            >
              <CardContent className="p-8 h-full min-h-[240px] flex flex-col items-center justify-center gap-4">
                <div className="size-16 rounded-full bg-primary-100 flex items-center justify-center">
                  <Plus className="size-8 text-primary-600" />
                </div>
                <span className="font-semibold text-lg text-gray-700">
                  새 루틴 만들기
                </span>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

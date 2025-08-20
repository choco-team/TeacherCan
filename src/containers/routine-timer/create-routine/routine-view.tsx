'use client';

import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Clock, ArrowLeft, Play } from 'lucide-react';
import { MENU_ROUTE } from '@/constants/route';
import { formatTime } from '../play-routine/utils/formatter';
import { useRoutine } from './use-routine';
import { RouteParams } from './routine-types';

export default function RoutineView({ params }: RouteParams): JSX.Element {
  const router = useRouter();
  const routineId = params.id;
  const { routine } = useRoutine(routineId);

  const handleRoutineList = () => {
    router.push(MENU_ROUTE.ROUTINE_TIMER);
  };

  const handleEditMode = () => {
    router.push(`${MENU_ROUTE.ROUTINE_TIMER}/edit/${routineId}`);
  };

  const handleStartRoutine = () => {
    router.push(`${MENU_ROUTE.ROUTINE_TIMER}/play/${routineId}`);
  };

  return (
    <div className="w-full max-w-screen-md mx-auto">
      {/* 헤더 섹션 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="gray-ghost"
            size="sm"
            onClick={handleRoutineList}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          >
            <ArrowLeft className="size-4" />
            목록으로
          </Button>
          <div className="flex items-center gap-x-3">
            <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium flex items-center whitespace-nowrap shadow-sm">
              <Clock className="size-4 mr-2" />
              {Math.floor(routine.totalTime / 60)}분 {routine.totalTime % 60}초
            </div>
            <Button variant="primary-outline" onClick={handleEditMode}>
              수정
            </Button>
            <Button
              onClick={handleStartRoutine}
              disabled={!routine.title || !routine.activities.length}
              className="flex items-center gap-2"
            >
              <Play className="size-4" />
              시작
            </Button>
          </div>
        </div>

        {/* 루틴 제목 */}
        <div className="text-2xl font-bold text-gray-800">
          {routine.title || '제목 없음'}
        </div>
      </div>

      {/* 활동 목록 */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-gray-800">활동</CardTitle>
        </CardHeader>
        <CardContent>
          {routine.activities.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base font-medium text-gray-600 mb-2">
                아직 활동이 없어요
              </h3>
              <p className="text-sm text-gray-500">
                활동을 추가하여 루틴을 만들어보세요.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {routine.activities.map(({ id, order, action, time }) => (
                <div
                  key={id}
                  className="p-4 border border-gray-200 rounded-lg bg-white transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    {/* 순서 번호 */}
                    <div className="flex items-center justify-center size-7 bg-gradient-to-br from-primary-300 to-primary-500 text-white rounded-full text-xs font-bold shadow-sm">
                      {order}
                    </div>

                    {/* 활동 이름 */}
                    <div className="flex-1 min-w-0 text-sm text-gray-800">
                      {action}
                    </div>

                    {/* 시간 표시 */}
                    <div className="flex items-center gap-1">
                      <Clock className="size-4 text-gray-400" />
                      <div className="w-16 text-end text-sm font-mono text-gray-700">
                        {formatTime(time)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

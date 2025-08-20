'use client';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Clock, Plus, ArrowLeft } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { MENU_ROUTE } from '@/constants/route';
import { ActivityCard } from './activity-card';
import { useRoutine } from './use-routine';
import { RouteParams } from './routine-types';

export default function RoutineForm({ params }: RouteParams): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const routineId = params?.id;

  const isNew = pathname.includes('new');

  const {
    routine,
    handleChangeActivity,
    handleAddActivity,
    handleRemoveActivity,
    handleReorderActivities,
    updateRoutineTitle,
    saveRoutine,
  } = useRoutine(isNew ? null : routineId);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = routine.activities.findIndex(
        (item) => item.id === active.id,
      );
      const newIndex = routine.activities.findIndex(
        (item) => item.id === over?.id,
      );

      const newOrder = arrayMove(routine.activities, oldIndex, newIndex);
      handleReorderActivities(newOrder);
    }
  };

  const handleRoutineList = () => {
    router.push(MENU_ROUTE.ROUTINE_TIMER);
  };

  const handleViewMode = () => {
    router.push(`${MENU_ROUTE.ROUTINE_TIMER}/${routineId}`);
  };

  const canAddActivity = routine.activities.length < 10;

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
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium flex items-center whitespace-nowrap shadow-sm">
              <Clock className="size-4 mr-2" />
              {Math.floor(routine.totalTime / 60)}분 {routine.totalTime % 60}초
            </div>
            <div className="flex items-center gap-2">
              {!isNew && (
                <Button
                  variant="gray-outline"
                  onClick={handleViewMode}
                  className="text-gray-600 hover:text-gray-800"
                >
                  취소
                </Button>
              )}
              <Button
                disabled={!routine.title || !routine.activities.length}
                onClick={saveRoutine}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-600 transition-colors"
              >
                저장
              </Button>
            </div>
          </div>
        </div>

        {/* 루틴 제목 입력 */}
        <Input
          type="text"
          value={routine.title}
          onChange={(event) => updateRoutineTitle(event.target.value)}
          placeholder="루틴 이름"
          className="text-2xl font-bold"
        />
      </div>

      {/* 활동 목록 */}
      <Card className="shadow-none">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-gray-800">활동</CardTitle>
            <Button
              variant="primary-outline"
              size="sm"
              onClick={handleAddActivity}
              disabled={!canAddActivity}
            >
              <Plus className="size-4 me-1" />
              활동 추가
            </Button>
          </div>
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={routine.activities.map((activity) => activity.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {routine.activities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      onActivityChange={handleChangeActivity}
                      onRemove={handleRemoveActivity}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

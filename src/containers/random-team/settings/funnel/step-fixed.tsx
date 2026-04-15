'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Card } from '@/components/card';
import { Label } from '@/components/label';
import { Button } from '@/components/button';
import { Heading1, Heading3 } from '@/components/heading';
import { useToast } from '@/hooks/use-toast';

type PreAssignment = {
  student: string;
  groupIndex: number;
};

type Props = {
  students: string[];
  teamCount: number;
  preAssignments: PreAssignment[];
  showFixedMark: boolean; // 추가
  onChangePreAssignments: (list: PreAssignment[]) => void;
  onChangeShowFixedMark: (value: boolean) => void; // 추가
  onPrev: () => void;
  onNext: () => void;
};

export default function StepFixed({
  students,
  teamCount,
  preAssignments,
  showFixedMark,
  onChangePreAssignments,
  onChangeShowFixedMark,
  onPrev,
  onNext,
}: Props) {
  const { toast } = useToast();

  const [localAssignments, setLocalAssignments] =
    useState<PreAssignment[]>(preAssignments);

  useEffect(() => {
    setLocalAssignments(preAssignments);
  }, [preAssignments]);

  const assignedStudents = useMemo(
    () => new Set(localAssignments.map((a) => a.student)),
    [localAssignments],
  );

  const unassignedStudents = useMemo(
    () => students.filter((s) => !assignedStudents.has(s)),
    [students, assignedStudents],
  );

  const maxSize = Math.ceil(students.length / teamCount);

  const getTeamAssignments = (groupIndex: number) =>
    localAssignments.filter((a) => a.groupIndex === groupIndex);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    student: string,
  ) => {
    e.dataTransfer.setData('text/plain', student);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    groupIndex: number,
  ) => {
    e.preventDefault();
    const student = e.dataTransfer.getData('text/plain');
    if (!student) return;
    if (assignedStudents.has(student)) return;
    if (getTeamAssignments(groupIndex).length >= maxSize) return;
    setLocalAssignments([...localAssignments, { student, groupIndex }]);
  };

  const handleRemoveFixed = (student: string) => {
    setLocalAssignments(localAssignments.filter((a) => a.student !== student));
  };

  const handleSave = () => {
    onChangePreAssignments(localAssignments);
    toast({
      title: '고정 배정이 저장되었습니다.',
      description: `총 ${localAssignments.length}명의 학생이 고정되었습니다.`,
      variant: 'success',
    });
  };

  return (
    <>
      <Heading1 className="text-xl font-bold">3단계 · 고정 학생 설정</Heading1>

      <p className="text-sm text-gray-600">
        특정 학생을 미리 같은 모둠으로 지정할 수 있습니다.
      </p>

      {/* 🔒 표시 여부 토글 */}
      <Card className="p-4 w-full flex items-center justify-between">
        <div>
          <Label className="font-semibold text-sm">고정 학생 표시 🔒</Label>
          <p className="text-xs text-gray-500 mt-0.5">
            결과 화면에서 고정된 학생을 표시합니다.
          </p>
        </div>
        <button
          type="button"
          aria-label="고정 학생 표시 여부 토글"
          onClick={() => onChangeShowFixedMark(!showFixedMark)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
            showFixedMark ? 'bg-primary' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
              showFixedMark ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </Card>

      <Card className="p-4 w-full">
        <Label className="mb-2 font-semibold text-sm">고정되지 않은 학생</Label>

        <div className="flex flex-wrap gap-1 h-28 overflow-y-auto mb-2 border rounded p-2 bg-gray-50 w-full">
          {unassignedStudents.map((student) => (
            <div
              key={student}
              draggable
              onDragStart={(e) => handleDragStart(e, student)}
              className="px-2 py-[2px] bg-white border rounded text-xs cursor-grab hover:bg-gray-100 h-fit"
            >
              {student}
            </div>
          ))}
          {unassignedStudents.length === 0 && (
            <p className="text-xs text-gray-500">남은 학생 없음</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: teamCount }, (_, idx) => {
            const teamAssignments = getTeamAssignments(idx);
            const isFull = teamAssignments.length >= maxSize;

            return (
              <Card
                key={idx}
                className={`p-1 border-dashed border-2 min-h-[100px] ${isFull ? 'opacity-50' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
              >
                <Heading3 className="font-semibold mb-1 text-center text-sm">
                  모둠 {idx + 1}
                </Heading3>

                <div className="flex flex-wrap justify-center gap-1 max-h-28 overflow-y-auto">
                  {teamAssignments.map((assignment) => (
                    <div
                      key={assignment.student}
                      className="flex items-center gap-1 px-1 py-[2px] bg-white border rounded text-xs"
                    >
                      <span className="truncate max-w-[70px]">
                        {assignment.student}
                      </span>
                      <Button
                        variant="gray-ghost"
                        size="sm"
                        onClick={() => handleRemoveFixed(assignment.student)}
                        className="p-0"
                      >
                        <X className="w-3 h-3 text-gray-500 hover:text-black" />
                      </Button>
                    </div>
                  ))}
                  {teamAssignments.length === 0 && (
                    <p className="text-xs text-gray-500 w-full text-center mt-1">
                      학생 없음
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center mt-6">
          <Button variant="primary" onClick={handleSave} className="px-6">
            고정 배정 저장
          </Button>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="primary-outline" onClick={onPrev}>
          이전
        </Button>
        <Button variant="primary" onClick={onNext}>
          다음
        </Button>
      </div>
    </>
  );
}

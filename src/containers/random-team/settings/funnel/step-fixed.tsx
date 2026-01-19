'use client';

import React, { useMemo } from 'react';
import { Card } from '@/components/card';
import { Label } from '@/components/label';
import { Button } from '@/components/button';
import { Heading1, Heading3 } from '@/components/heading';
import { X } from 'lucide-react';

type PreAssignment = {
  student: string;
  groupIndex: number;
};

type Props = {
  students: string[];
  teamCount: number;
  preAssignments: PreAssignment[];
  onChangePreAssignments: (list: PreAssignment[]) => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function StepFixed({
  students,
  teamCount,
  preAssignments,
  onChangePreAssignments,
  onPrev,
  onNext,
}: Props) {
  const assignedStudents = useMemo(
    () => new Set(preAssignments.map((a) => a.student)),
    [preAssignments],
  );

  const unassignedStudents = useMemo(
    () => students.filter((s) => !assignedStudents.has(s)),
    [students, assignedStudents],
  );

  const maxSize = Math.ceil(students.length / teamCount);

  const getTeamAssignments = (groupIndex: number) =>
    preAssignments.filter((a) => a.groupIndex === groupIndex);

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
    if (!student || assignedStudents.has(student)) return;
    if (getTeamAssignments(groupIndex).length >= maxSize) return;

    onChangePreAssignments([...preAssignments, { student, groupIndex }]);
  };

  const handleRemoveFixed = (student: string) => {
    onChangePreAssignments(preAssignments.filter((a) => a.student !== student));
  };

  return (
    <>
      <Heading1 className="text-xl font-bold">3단계 · 고정 학생 설정</Heading1>

      <p className="text-sm text-gray-600">
        특정 학생을 미리 같은 모둠으로 지정할 수 있습니다. 설정하지 않아도
        배정에는 문제가 없습니다.
      </p>

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
                className={`p-1 border-dashed border-2 min-h-[100px] ${
                  isFull ? 'opacity-50' : ''
                }`}
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
      </Card>

      <div className="flex justify-between">
        <Button variant="gray-ghost" onClick={onPrev}>
          이전
        </Button>
        <Button variant="primary" onClick={onNext}>
          다음
        </Button>
      </div>
    </>
  );
}

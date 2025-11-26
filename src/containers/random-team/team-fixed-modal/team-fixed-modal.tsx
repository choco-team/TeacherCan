'use client';

import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Label } from '@/components/label';
import { X } from 'lucide-react';
import { Heading3 } from '@/components/heading';

type Props = {
  students: string[];
  groupCount: number;
  onClose: () => void;
  onSave: (assignments: { student: string; groupIndex: number }[]) => void;
};

export default function TeamFixedModal({
  students,
  groupCount,
  onClose,
  onSave,
}: Props) {
  const [groupAssignments, setGroupAssignments] = useState<
    Record<number, string[]>
  >(() => {
    const base: Record<number, string[]> = {};
    for (let i = 0; i < groupCount; i += 1) base[i] = [];
    return base;
  });

  const assignedStudents = useMemo(
    () => Object.values(groupAssignments).flat(),
    [groupAssignments],
  );

  const unassignedStudents = useMemo(
    () => students.filter((s) => !assignedStudents.includes(s)),
    [students, assignedStudents],
  );

  // ⭐ 최대 인원 수 설정
  const maxSize = Math.ceil(students.length / groupCount);

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

    // 이미 배정된 학생은 무시
    if (assignedStudents.includes(student)) return;

    // ⭐ 최대 인원 제한 —— 초과 시 추가 안 됨
    if (groupAssignments[groupIndex].length >= maxSize) {
      return;
    }

    setGroupAssignments((prev) => ({
      ...prev,
      [groupIndex]: [...prev[groupIndex], student],
    }));
  };

  const handleRemoveStudent = (groupIndex: number, student: string) => {
    setGroupAssignments((prev) => ({
      ...prev,
      [groupIndex]: prev[groupIndex].filter((s) => s !== student),
    }));
  };

  const handleSave = () => {
    const result: { student: string; groupIndex: number }[] = [];
    Object.entries(groupAssignments).forEach(([groupIndex, list]) => {
      list.forEach((student) =>
        result.push({ student, groupIndex: Number(groupIndex) }),
      );
    });
    onSave(result);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>고정 배정 설정</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          {/* 남은 학생 */}
          <Card className="p-1">
            <Label className="mb-1 text-sm">남은 학생</Label>
            <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto">
              {unassignedStudents.map((student) => (
                <div
                  key={student}
                  draggable
                  onDragStart={(e) => handleDragStart(e, student)}
                  className="px-2 py-[2px] bg-white border rounded text-xs cursor-grab hover:bg-gray-100"
                >
                  {student}
                </div>
              ))}
              {unassignedStudents.length === 0 && (
                <p className="text-xs text-gray-500">남은 학생 없음</p>
              )}
            </div>
          </Card>

          {/* 모둠 카드 */}
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: groupCount }, (_, groupIndex) => (
              <Card
                key={groupIndex}
                className={`p-1 border-dashed border-2 min-h-[100px] ${
                  groupAssignments[groupIndex].length >= maxSize
                    ? 'opacity-50'
                    : ''
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, groupIndex)}
              >
                <Heading3 className="font-semibold mb-1 text-center text-sm">
                  모둠 {groupIndex + 1}
                </Heading3>

                <div className="flex flex-wrap justify-center gap-1 max-h-28 overflow-y-auto">
                  {groupAssignments[groupIndex].map((student) => (
                    <div
                      key={student}
                      draggable
                      onDragStart={(e) => handleDragStart(e, student)}
                      className="flex items-center gap-1 px-1 py-[2px] bg-white border rounded text-xs cursor-grab hover:bg-gray-100"
                    >
                      <span className="truncate max-w-[70px]">{student}</span>
                      <Button
                        variant="gray-ghost"
                        size="sm"
                        onClick={() => handleRemoveStudent(groupIndex, student)}
                        className="p-0"
                      >
                        <X className="w-3 h-3 text-gray-500 hover:text-black" />
                      </Button>
                    </div>
                  ))}
                  {groupAssignments[groupIndex].length === 0 && (
                    <p className="text-xs text-gray-500 w-full text-center mt-1">
                      학생 없음
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
          <Button variant="primary" onClick={handleSave}>
            저장하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

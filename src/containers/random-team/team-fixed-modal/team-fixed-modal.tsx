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
    if (!student || assignedStudents.includes(student)) return;

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
          {/* 남은 학생 가로 배치 */}
          <Card className="p-1">
            <Label className="mb-1 text-sm">남은 학생</Label>
            <div className="flex flex-wrap gap-1">
              {unassignedStudents.map((student) => (
                <div
                  key={student}
                  draggable
                  onDragStart={(e) => handleDragStart(e, student)}
                  className="px-2 py-0.5 bg-white border rounded text-xs cursor-grab hover:bg-gray-100"
                >
                  {student}
                </div>
              ))}
              {unassignedStudents.length === 0 && (
                <p className="text-xs text-gray-500">남은 학생 없음</p>
              )}
            </div>
          </Card>

          {/* 모둠 박스 */}
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: groupCount }, (_, groupIndex) => (
              <Card
                key={groupIndex}
                className="p-1 border-dashed border-2 h-32 flex flex-col"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, groupIndex)}
              >
                <h3 className="font-semibold mb-1 text-center text-sm">
                  모둠 {groupIndex + 1}
                </h3>

                <div className="flex-1 flex flex-wrap justify-center overflow-y-auto gap-1">
                  {groupAssignments[groupIndex].map((student) => (
                    <div
                      key={student}
                      draggable
                      onDragStart={(e) => handleDragStart(e, student)}
                      className="px-1 py-0.5 bg-white border rounded text-xs flex items-center gap-1 cursor-grab hover:bg-gray-100"
                    >
                      {student}
                      <Button
                        variant="gray-ghost"
                        size="sm"
                        onClick={() => handleRemoveStudent(groupIndex, student)}
                        className="ml-1 p-0"
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

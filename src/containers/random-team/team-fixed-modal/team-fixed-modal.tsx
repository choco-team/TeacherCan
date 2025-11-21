'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';
import { Button } from '@/components/button';
import { Label } from '@/components/label';
import { X } from 'lucide-react';
import React, { useState, useMemo } from 'react';

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
  // 각 모둠별 고정 배정: groupIndex → 학생 배열
  const [groupAssignments, setGroupAssignments] = useState<
    Record<number, string[]>
  >(() => {
    const base: Record<number, string[]> = {};
    for (let i = 0; i < groupCount; i += 1) base[i] = [];
    return base;
  });

  // 이미 고정된 학생들 목록
  const assignedStudents = useMemo(() => {
    return Object.values(groupAssignments).flat();
  }, [groupAssignments]);

  // 특정 모둠에 학생 추가
  const handleAddStudent = (groupIndex: number, student: string) => {
    if (!student) return;
    if (assignedStudents.includes(student)) return; // 중복 X

    setGroupAssignments((prev) => ({
      ...prev,
      [groupIndex]: [...prev[groupIndex], student],
    }));
  };

  // 특정 모둠에서 학생 제거
  const handleRemoveStudent = (groupIndex: number, student: string) => {
    setGroupAssignments((prev) => ({
      ...prev,
      [groupIndex]: prev[groupIndex].filter((s) => s !== student),
    }));
  };

  // 저장 시 기존 구조로 변환
  const handleSave = () => {
    const result: { student: string; groupIndex: number }[] = [];
    Object.entries(groupAssignments).forEach(([groupIndex, list]) => {
      list.forEach((student) =>
        result.push({ student, groupIndex: Number(groupIndex) }),
      );
    });
    onSave(result);
  };

  const groupsWithId = Array.from({ length: groupCount }, (_, i) => ({
    id: `group-${i}-${Date.now()}`, // 고유 id 생성
    members: [] as string[],
  }));

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>고정 배정 설정</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {groupsWithId.map((group, groupIndex) => (
            <div
              key={group.id} // 여기서 고유 id 사용
              className="border rounded p-3 bg-gray-50 shadow-sm"
            >
              <h3 className="font-semibold mb-2">{groupIndex + 1} 모둠</h3>

              {/* 고정 학생 목록 */}
              <div className="space-y-1 mb-3">
                {groupAssignments[groupIndex].map((student) => (
                  <div
                    key={student}
                    className="flex items-center justify-between bg-white px-2 py-1 rounded border"
                  >
                    <span className="font-bold">{student}</span>
                    <Button
                      onClick={() => handleRemoveStudent(groupIndex, student)}
                    >
                      <X className="w-4 h-4 text-gray-500 hover:text-black" />
                    </Button>
                  </div>
                ))}

                {groupAssignments[groupIndex].length === 0 && (
                  <p className="text-xs text-gray-500">고정 학생 없음</p>
                )}
              </div>

              {/* 학생 추가 드롭다운 */}
              <div>
                <Label className="text-sm">학생 추가</Label>
                <select
                  className="w-full border rounded px-2 py-1 bg-white mt-1"
                  onChange={(e) => {
                    handleAddStudent(groupIndex, e.target.value);
                    e.target.value = '';
                  }}
                  defaultValue=""
                >
                  <option value="">학생 선택</option>

                  {students.map((s) => (
                    <option
                      key={s}
                      value={s}
                      disabled={assignedStudents.includes(s)}
                    >
                      {assignedStudents.includes(s) ? `🔒 ${s}` : s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
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

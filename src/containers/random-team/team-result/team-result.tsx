'use client';

import { Button } from '@/components/button';
import React, { useState, useEffect, useCallback } from 'react';

type Member = { id: string; name: string };
type Group = { id: string; members: Member[] };

type Props = {
  students: string[];
  groupCount: number;
  preAssignments?: { student: string; groupIndex: number }[];
};

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export default function TeamResult({
  students,
  groupCount,
  preAssignments = [],
}: Props) {
  const [groups, setGroups] = useState<Group[]>([]);

  const handleGroupAssign = useCallback(() => {
    if (!students || students.length === 0 || groupCount <= 0) {
      setGroups([]);
      return;
    }

    const members = students.map((name) => ({ id: makeId(), name }));

    // 🟦 1) 고정 배정 그룹 초기화
    const fixedGroups = Array.from({ length: groupCount }, () => ({
      id: makeId(),
      members: [] as Member[],
    }));

    // 🟩 이미 고정된 학생들 집합
    const assignedNames = new Set<string>();

    // 🟩 2) 고정 배정 적용
    preAssignments.forEach((a) => {
      const target = members.find((m) => m.name === a.student);
      if (target) {
        fixedGroups[a.groupIndex].members.push(target);
        assignedNames.add(target.name);
      }
    });

    // 🟧 3) 남는 학생들만 셔플
    const remaining = members.filter((m) => !assignedNames.has(m.name));
    const shuffled = [...remaining].sort(() => Math.random() - 0.5);

    // 🟨 4) 균등하게 남은 학생 배정
    shuffled.forEach((member, idx) => {
      const groupIndex = idx % groupCount;
      fixedGroups[groupIndex].members.push(member);
    });

    setGroups(fixedGroups);
  }, [students, groupCount, preAssignments]);

  useEffect(() => {
    handleGroupAssign();
  }, [handleGroupAssign]);

  return (
    <div className="mt-6">
      {groups.length > 0 && (
        <>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group, idx) => (
              <div
                key={group.id}
                className="p-3 border rounded bg-gray-50 shadow-sm"
              >
                <h3 className="font-semibold mb-2">모둠 {idx + 1}</h3>

                <ul className="list-disc list-inside space-y-1">
                  {group.members.map((member) => {
                    // 🔒 고정 배정된 학생 표시 (볼드)
                    const isFixed = preAssignments.some(
                      (a) => a.student === member.name && a.groupIndex === idx,
                    );

                    return (
                      <li
                        key={member.id}
                        className={isFixed ? 'font-bold text-black' : ''}
                      >
                        {member.name}
                        {isFixed && ' 🔒'}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4">
            <Button onClick={handleGroupAssign} variant="primary">
              재배정하기
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

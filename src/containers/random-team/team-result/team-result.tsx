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

    // 🟩 고정된 학생을 중복 배정 안 하기 위한 세트
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

    // 🟥 4) 총 목표 인원(균등 분배 기준)
    const total = members.length;
    const base = Math.floor(total / groupCount);
    const rest = total % groupCount;

    const targetSizes = Array.from({ length: groupCount }, (_, i) =>
      i < rest ? base + 1 : base,
    );

    // 각 그룹에 추가로 넣을 수 있는 capacity
    const capacities = fixedGroups.map(
      (g, i) => targetSizes[i] - g.members.length,
    );

    // 🟦 5) 재귀로 균등 배정 (let 없이)
    const assignRecursively = (
      remain: Member[],
      resultGroups: Group[],
      caps: number[],
    ): Group[] => {
      if (remain.length === 0) return resultGroups;

      const student = remain[0];

      const nextGroupIndex = caps
        .map((c, idx) => ({ cap: c, idx }))
        .filter((c) => c.cap > 0)
        .sort((a, b) => a.idx - b.idx)[0]?.idx;

      if (nextGroupIndex === undefined) {
        return resultGroups;
      }

      const newGroups = resultGroups.map((g, i) =>
        i === nextGroupIndex ? { ...g, members: [...g.members, student] } : g,
      );

      const newCaps = caps.map((cap, i) =>
        i === nextGroupIndex ? cap - 1 : cap,
      );

      return assignRecursively(remain.slice(1), newGroups, newCaps);
    };

    // 🟩 6) 최종 그룹 계산
    const finalGroups = assignRecursively(shuffled, fixedGroups, capacities);

    setGroups(finalGroups);
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

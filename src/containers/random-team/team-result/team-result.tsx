'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Heading3 } from '@/components/heading';

type Member = { id: string; name: string };
type Group = { id: string; members: Member[] };

type Props = {
  students: string[];
  groupCount: number;
  preAssignments?: { student: string; groupIndex: number }[];
  onAssignRef?: React.MutableRefObject<(() => void) | undefined>;
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
  onAssignRef,
}: Props) {
  const [groups, setGroups] = useState<Group[]>([]);

  const handleGroupAssign = useCallback(() => {
    if (!students || students.length === 0 || groupCount <= 0) {
      setGroups([]);
      return;
    }

    const members = students.map((name) => ({ id: makeId(), name }));

    const fixedGroups = Array.from({ length: groupCount }, () => ({
      id: makeId(),
      members: [] as Member[],
    }));

    const assignedNames = new Set<string>();
    preAssignments.forEach((a) => {
      const target = members.find((m) => m.name === a.student);
      if (target) {
        fixedGroups[a.groupIndex].members.push(target);
        assignedNames.add(target.name);
      }
    });

    const remaining = members.filter((m) => !assignedNames.has(m.name));
    const shuffled = [...remaining].sort(() => Math.random() - 0.5);

    const total = members.length;
    const base = Math.floor(total / groupCount);
    const rest = total % groupCount;
    const targetSizes = Array.from({ length: groupCount }, (_, i) =>
      i < rest ? base + 1 : base,
    );

    const capacities = fixedGroups.map(
      (g, i) => targetSizes[i] - g.members.length,
    );

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

      if (nextGroupIndex === undefined) return resultGroups;

      const newGroups = resultGroups.map((g, i) =>
        i === nextGroupIndex ? { ...g, members: [...g.members, student] } : g,
      );

      const newCaps = caps.map((cap, i) =>
        i === nextGroupIndex ? cap - 1 : cap,
      );

      return assignRecursively(remain.slice(1), newGroups, newCaps);
    };

    const finalGroups = assignRecursively(shuffled, fixedGroups, capacities);
    setGroups(finalGroups);
  }, [students, groupCount, preAssignments]);

  useEffect(() => {
    if (onAssignRef) {
      const ref = onAssignRef;
      ref.current = handleGroupAssign;
    }
  }, [handleGroupAssign, onAssignRef]);

  useEffect(() => {
    handleGroupAssign();
  }, [handleGroupAssign]);

  return (
    <div className="mt-6">
      {groups.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {groups.map((group, idx) => (
            <div
              key={group.id}
              className="p-3 border rounded bg-gray-50 shadow-sm"
            >
              <Heading3 className="font-semibold mb-2">모둠 {idx + 1}</Heading3>
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
      )}
    </div>
  );
}

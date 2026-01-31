'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  MutableRefObject,
} from 'react';
import { Heading3 } from '@/components/heading';

type Member = {
  id: string;
  name: string;
};

type Group = {
  id: string;
  members: Member[];
};

export type PreAssignment = {
  student: string;
  groupIndex: number;
};

type Props = {
  students: string[];
  teamCount: number;
  preAssignments?: PreAssignment[];
  assignRef?: MutableRefObject<(() => void) | undefined>;
};

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function TeamResult({
  students,
  teamCount,
  preAssignments = [],
  assignRef,
}: Props) {
  const [groups, setGroups] = useState<Group[]>([]);

  const assignTeams = useCallback(() => {
    if (students.length === 0 || teamCount <= 0) {
      setGroups([]);
      return;
    }

    const members: Member[] = students.map((name) => ({
      id: makeId(),
      name,
    }));

    const groupsBase: Group[] = Array.from({ length: teamCount }, () => ({
      id: makeId(),
      members: [],
    }));

    const assigned = new Set<string>();

    preAssignments.forEach(({ student, groupIndex }) => {
      const member = members.find((m) => m.name === student);
      if (!member) return;

      groupsBase[groupIndex]?.members.push(member);
      assigned.add(member.name);
    });

    const remaining = shuffle(members.filter((m) => !assigned.has(m.name)));

    const baseSize = Math.floor(members.length / teamCount);
    const extra = members.length % teamCount;

    const capacities = groupsBase.map((group, idx) => {
      const targetSize = idx < extra ? baseSize + 1 : baseSize;
      return targetSize - group.members.length;
    });

    let cursor = 0;

    remaining.forEach((member) => {
      while (capacities[cursor] === 0) {
        cursor = (cursor + 1) % teamCount;
      }

      groupsBase[cursor].members.push(member);
      capacities[cursor] -= 1;
    });

    setGroups(groupsBase);
  }, [students, teamCount, preAssignments]);

  useEffect(() => {
    if (!assignRef) return;

    const ref = assignRef;
    ref.current = assignTeams;
  }, [assignTeams, assignRef]);

  useEffect(() => {
    assignTeams();
  }, [assignTeams]);

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
                    <li key={member.id} className={isFixed ? 'font-bold' : ''}>
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

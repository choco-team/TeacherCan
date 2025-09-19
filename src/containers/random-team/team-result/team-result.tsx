'use client';

import { Button } from '@/components/button';
import React, { useState, useEffect, useCallback } from 'react';

type Member = { id: string; name: string };
type Group = { id: string; members: Member[] };

type Props = {
  students: string[];
  groupCount: number;
};

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export default function TeamResult({ students, groupCount }: Props) {
  const [groups, setGroups] = useState<Group[]>([]);

  const handleGroupAssign = useCallback(() => {
    if (!students || students.length === 0 || groupCount <= 0) {
      setGroups([]);
      return;
    }

    const members: Member[] = students.map((name) => ({
      id: makeId(),
      name,
    }));

    const shuffled = [...members].sort(() => Math.random() - 0.5);

    const newGroups: Group[] = Array.from({ length: groupCount }, () => ({
      id: makeId(),
      members: [],
    }));

    shuffled.forEach((member, idx) => {
      newGroups[idx % groupCount].members.push(member);
    });

    setGroups(newGroups);
  }, [students, groupCount]);

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
                  {group.members.map((member) => (
                    <li key={member.id}>{member.name}</li>
                  ))}
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

'use client';

import React, { useState, useEffect } from 'react';

type Member = { id: string; name: string };
type Group = { id: string; members: Member[] };

type Props = {
  students: string[];
  groupCount: number;
};

// 간단한 유닉 아이디 생성기 (브라우저에서 crypto.randomUUID 사용 가능하면 사용)
function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    // @ts-ignore - TS may not know randomUUID on older libs
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export default function TeamResult({ students, groupCount }: Props) {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    if (!students || students.length === 0 || groupCount <= 0) {
      setGroups([]);
      return;
    }

    // students -> Member 배열(각각 고유 id 포함)
    const members: Member[] = students.map((name) => ({
      id: makeId(),
      name,
    }));

    // 셔플 (간단한 방법)
    const shuffled = [...members].sort(() => Math.random() - 0.5);

    // 그룹 객체 생성 (각 그룹에 고유 id 포함)
    const newGroups: Group[] = Array.from({ length: groupCount }, () => ({
      id: makeId(),
      members: [],
    }));

    // 순서대로 분배
    shuffled.forEach((member, idx) => {
      newGroups[idx % groupCount].members.push(member);
    });

    setGroups(newGroups);
  }, [students, groupCount]);

  return (
    <div className="mt-6">
      {groups.length > 0 && (
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
      )}
    </div>
  );
}

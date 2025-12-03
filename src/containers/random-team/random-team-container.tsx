'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Card } from '@/components/card';

export default function RandomTeamContainer() {
  const [settings, setSettings] = useState<{
    students: string[];
    teamCount: number;
    fixedAssignments: Record<string, string[]>;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('randomTeamSettings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const teams = useMemo(() => {
    if (!settings) return [];
    const ids = Array.from({ length: settings.teamCount }, () =>
      crypto.randomUUID(),
    );
    return ids.map((id) => ({
      id,
      members: settings.fixedAssignments[id] ?? [],
    }));
  }, [settings]);

  if (!settings) return <p>설정 데이터를 불러오는 중...</p>;

  return (
    <div className="p-4 max-w-xl mx-auto flex flex-col gap-4">
      <h1 className="text-xl font-bold">랜덤 팀 구성</h1>
      {teams.map((team, idx) => (
        <Card key={team.id} className="p-2 border">
          <h2 className="font-semibold mb-2">모둠 {idx + 1}</h2>
          <ul>
            {(team.members.length > 0 ? team.members : ['학생 없음']).map(
              (member) => (
                <li key={member}>{member}</li>
              ),
            )}
          </ul>
        </Card>
      ))}
    </div>
  );
}

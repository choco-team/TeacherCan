'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/button';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import TeamResult from '@/containers/random-team/team-result/team-result';
import { Heading1 } from '@/components/heading';

type PreAssignment = {
  student: string;
  groupIndex: number;
};

export default function RandomTeamContainer() {
  const [settings, setSettings] = useState<{
    students: string[];
    teamCount: number;
    preAssignments: PreAssignment[];
    showFixedIndicator: boolean;
  } | null>(null);

  const [showResult, setShowResult] = useState(false);
  const assignRef = useRef<() => void>();

  /** 설정 불러오기 */
  useEffect(() => {
    const saved = localStorage.getItem('randomTeamSettings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
  }, []);

  useEffect(() => {
    if (!settings) return;

    const autoRun = localStorage.getItem('randomTeamAutoRun');

    if (autoRun === 'true') {
      setShowResult(true);

      requestAnimationFrame(() => {
        assignRef.current?.();
      });

      localStorage.removeItem('randomTeamAutoRun');
    }
  }, [settings]);

  const handleAssignTeams = () => {
    setShowResult(true);
    assignRef.current?.();
  };

  if (!settings) return <p>설정 데이터를 불러오는 중...</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Heading1 className="text-xl font-bold">랜덤 팀 구성</Heading1>
        <Link href="/random-team/settings/1">
          <Button variant="gray-ghost" size="sm" className="p-2">
            <Settings className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      <Button
        variant="primary"
        size="sm"
        onClick={handleAssignTeams}
        className="w-fit"
      >
        {showResult ? '재배정' : '랜덤 팀 뽑기'}
      </Button>

      {showResult && (
        <TeamResult
          students={settings.students}
          groupCount={settings.teamCount}
          preAssignments={settings.preAssignments}
          showFixedIndicator={settings.showFixedIndicator}
          onAssignRef={assignRef}
        />
      )}
    </div>
  );
}

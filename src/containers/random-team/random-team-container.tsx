'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/button';
import { Settings, Shuffle } from 'lucide-react';
import Link from 'next/link';
import TeamResult from '@/containers/random-team/team-result/team-result';
import { Heading1 } from '@/components/heading';
import { Card } from '@/components/card';

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
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
      <Card className="p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Heading1 className="text-xl font-bold">랜덤 모둠 구성</Heading1>

          <Link href="/random-team/settings/1">
            <Button variant="gray-ghost" size="sm" className="p-2">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div>
          <Button
            variant="primary"
            size="lg"
            onClick={handleAssignTeams}
            className="flex items-center gap-2"
          >
            <Shuffle className="w-4 h-4" />
            {showResult ? '모둠 재배정' : '랜덤 모둠 뽑기'}
          </Button>
        </div>
      </Card>

      {showResult && (
        <div className="animate-fade-in">
          <TeamResult
            students={settings.students}
            groupCount={settings.teamCount}
            preAssignments={settings.preAssignments}
            showFixedIndicator={settings.showFixedIndicator}
            onAssignRef={assignRef}
          />
        </div>
      )}
    </div>
  );
}

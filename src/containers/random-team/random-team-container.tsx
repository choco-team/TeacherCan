'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Settings, Shuffle } from 'lucide-react';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Heading1 } from '@/components/heading';

import TeamResult from '@/containers/random-team/team-result/team-result';
import { useRandomTeamSettings } from './hooks/useRandomTeamStorage';

export default function RandomTeamContainer() {
  const [settings] = useRandomTeamSettings();

  const [showResult, setShowResult] = useState(false);
  const assignRef = useRef<() => void>();

  const handleAssignTeams = () => {
    setShowResult(true);
    assignRef.current?.();
  };

  const isReady =
    settings &&
    Array.isArray(settings.students) &&
    typeof settings.teamCount === 'number';

  if (!settings) {
    return <p>설정 데이터를 불러오는 중...</p>;
  }

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

        <Button
          variant="primary"
          size="lg"
          onClick={handleAssignTeams}
          className="flex items-center gap-2 w-fit"
        >
          <Shuffle className="w-4 h-4" />
          {showResult ? '모둠 재배정' : '랜덤 모둠 뽑기'}
        </Button>
      </Card>

      {showResult && isReady && (
        <div className="animate-fade-in">
          <TeamResult
            students={settings.students}
            teamCount={settings.teamCount}
            preAssignments={settings.preAssignments}
            assignRef={assignRef}
          />
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Shuffle, Settings } from 'lucide-react';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Heading1 } from '@/components/heading';

import TeamResult from '@/containers/random-team/team-result/team-result';
import { useRandomTeamSettings } from './hooks/useRandomTeamStorage';

export default function RandomTeamContainer() {
  const [mounted, setMounted] = useState(false);

  const [settings] = useRandomTeamSettings();

  const [showResult, setShowResult] = useState(false);
  const assignRef = useRef<() => void>();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAssignTeams = () => {
    setShowResult(true);
    assignRef.current?.();
  };

  if (!mounted) {
    return null;
  }

  const hasSettings =
    settings &&
    Array.isArray(settings.students) &&
    settings.students.length > 0;

  const isReady = hasSettings && typeof settings.teamCount === 'number';

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
      <Card className="p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Heading1 className="text-xl font-bold">랜덤 모둠 구성</Heading1>

          <Link href="/random-team/settings/1">
            <Button
              variant="primary"
              size="sm"
              className="flex items-center gap-2 px-4 hover:shadow-md transition-all"
            >
              <Settings className="w-4 h-4" />
              {hasSettings ? '수정하기' : '시작하기'}
            </Button>
          </Link>
        </div>

        {isReady && (
          <div className="text-sm text-muted-foreground space-y-1 bg-gray-50 p-3 rounded border max-w-5xl">
            <p>학생 수: {settings.students.length}명</p>
            <p>모둠 수: {settings.teamCount}개</p>
            <p>고정 배정: {settings.preAssignments?.length ?? 0}명</p>
          </div>
        )}

        {isReady && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleAssignTeams}
            className="flex items-center gap-2 w-fit"
          >
            <Shuffle className="w-4 h-4" />
            {showResult ? '모둠 재배정' : '랜덤 모둠 뽑기'}
          </Button>
        )}
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

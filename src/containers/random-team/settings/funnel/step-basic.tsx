'use client';

import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/card';
import { Label } from '@/components/label';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Heading1 } from '@/components/heading';
import { useToast } from '@/hooks/use-toast';

type Props = {
  teamCount: number;
  onChangeTeamCount: (count: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function StepBasic({
  teamCount,
  onChangeTeamCount,
  onPrev,
  onNext,
}: Props) {
  const { toast } = useToast();

  const prevValueRef = useRef(teamCount);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prevValueRef.current !== teamCount) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        toast({
          title: '모둠 수가 설정되었습니다.',
          description: `${teamCount}개 모둠으로 설정되었습니다.`,
          variant: 'success',
        });

        prevValueRef.current = teamCount;
      }, 500);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [teamCount, toast]);

  return (
    <>
      <Heading1 className="text-xl font-bold">2단계 · 모둠 기본 설정</Heading1>

      <p className="text-sm text-gray-600">
        모둠의 전체 구조를 먼저 정합니다. 고정 학생 설정은 다음 단계에서 할 수
        있어요.
      </p>

      <Card className="p-4 w-full">
        <Label className="mb-2 font-semibold text-sm">모둠 수</Label>
        <Input
          type="number"
          min={1}
          value={teamCount}
          onChange={(e) => onChangeTeamCount(Number(e.target.value))}
          className="border p-2 rounded w-24"
        />
      </Card>

      <div className="flex justify-between">
        <Button variant="primary-outline" onClick={onPrev}>
          이전
        </Button>
        <Button variant="primary" onClick={onNext}>
          다음
        </Button>
      </div>
    </>
  );
}

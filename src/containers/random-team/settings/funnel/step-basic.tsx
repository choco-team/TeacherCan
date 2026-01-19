'use client';

import React from 'react';
import { Card } from '@/components/card';
import { Label } from '@/components/label';
import { Input } from '@/components/input';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { Button } from '@/components/button';
import { Heading1 } from '@/components/heading';

type Props = {
  teamCount: number;
  showFixedIndicator: boolean;
  onChangeTeamCount: (count: number) => void;
  onChangeShowFixedIndicator: (value: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function StepBasic({
  teamCount,
  showFixedIndicator,
  onChangeTeamCount,
  onChangeShowFixedIndicator,
  onPrev,
  onNext,
}: Props) {
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

      {/* 고정 학생 표시 */}
      <Card className="p-4 w-full">
        <Label className="mb-2 font-semibold text-sm">고정 학생 표시</Label>
        <RadioGroup className="flex gap-x-4">
          <Label className="flex items-center gap-x-2">
            <RadioGroupItem
              value="show"
              checked={showFixedIndicator}
              onClick={() => onChangeShowFixedIndicator(true)}
            />
            굵게 표시
          </Label>
          <Label className="flex items-center gap-x-2">
            <RadioGroupItem
              value="hide"
              checked={!showFixedIndicator}
              onClick={() => onChangeShowFixedIndicator(false)}
            />
            일반 표시
          </Label>
        </RadioGroup>
      </Card>

      {/* 네비게이션 */}
      <div className="flex justify-between">
        <Button variant="gray-ghost" onClick={onPrev}>
          이전
        </Button>
        <Button variant="primary" onClick={onNext}>
          다음
        </Button>
      </div>
    </>
  );
}

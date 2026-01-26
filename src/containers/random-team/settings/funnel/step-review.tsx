'use client';

import { Button } from '@/components/button';
import { Heading2 } from '@/components/heading';
import type { PreAssignment } from './types';

type StepReviewProps = {
  students: string[];
  teamCount: number;
  fixedAssignments: PreAssignment[];
  onPrev: () => void;
  onRun: () => void;
};

export default function StepReview({
  students,
  teamCount,
  fixedAssignments,
  onPrev,
  onRun,
}: StepReviewProps) {
  return (
    <div className="flex flex-col gap-6">
      <Heading2 className="text-xl font-semibold">설정 확인</Heading2>

      <div className="text-sm text-muted-foreground space-y-2">
        <p>학생 수: {students.length}명</p>
        <p>모둠 수: {teamCount}개</p>
        <p>고정 배정: {fixedAssignments.length}명</p>
      </div>

      <div className="flex justify-between">
        <Button variant="primary-outline" onClick={onPrev}>
          이전
        </Button>

        <Button variant="primary" onClick={onRun}>
          모둠 생성으로 가기
        </Button>
      </div>
    </div>
  );
}

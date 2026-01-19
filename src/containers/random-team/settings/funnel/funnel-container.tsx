'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import FunnelStepIndicator from './funnel-step-indicator';
import StepStudents from './step-students';
import StepBasic from './step-basic';
import StepFixed from './step-fixed';
import StepReview from './step-review';

import type { PreAssignment } from './types';

export default function FunnelContainer() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // 퍼널 전체에서 공유될 상태들
  const [students, setStudents] = useState<string[]>([]);
  const [teamCount, setTeamCount] = useState<number>(4);
  const [preAssignments, setPreAssignments] = useState<PreAssignment[]>([]);
  const [showFixedIndicator, setShowFixedIndicator] = useState<boolean>(true);

  const handleRun = () => {
    localStorage.setItem(
      'randomTeamSettings',
      JSON.stringify({
        students,
        teamCount,
        preAssignments,
        showFixedIndicator,
      }),
    );

    localStorage.setItem('randomTeamRun', 'true');

    router.push('/random-team');
  };

  return (
    <div className="p-4 w-full max-w-xl mx-auto flex flex-col gap-6">
      <FunnelStepIndicator currentStep={step} />

      {step === 1 && (
        <StepStudents
          students={students}
          onChangeStudents={(list) => {
            setStudents(list);
            setPreAssignments([]);
          }}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <StepBasic
          teamCount={teamCount}
          showFixedIndicator={showFixedIndicator}
          onChangeTeamCount={(count) => {
            setTeamCount(count);
            setPreAssignments([]);
          }}
          onChangeShowFixedIndicator={setShowFixedIndicator}
          onPrev={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <StepFixed
          students={students}
          teamCount={teamCount}
          preAssignments={preAssignments}
          onChangePreAssignments={setPreAssignments}
          onPrev={() => setStep(2)}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <StepReview
          students={students}
          teamCount={teamCount}
          fixedAssignments={preAssignments}
          onPrev={() => setStep(3)}
          onRun={handleRun}
        />
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import ActivityCount from './create-routine/activity-count';
import RoutineForm from './create-routine/routine-form';
import { RoutineItem } from './create-routine/routine-types';

function RoutineTimerContainer() {
  const [step, setStep] = useState<1 | 2>(1);
  const [routines, setRoutines] = useState<RoutineItem[]>([]);
  const handleCountSubmit = (selectedCount: number) => {
    setRoutines(
      Array.from({ length: selectedCount }, () => ({
        title: '',
        description: '',
        duration: 0,
        music: '',
      })),
    );
    setStep(2);
  };

  const handleGoBack = () => {
    setStep(1);
  };

  return (
    <div className="py-10 px-4 max-w-3xl mx-auto space-y-6">
      {step === 1 && <ActivityCount onNext={handleCountSubmit} />}
      {step === 2 && (
        <RoutineForm
          routines={routines}
          setRoutines={setRoutines}
          onPrevious={handleGoBack}
        />
      )}
    </div>
  );
}

export default RoutineTimerContainer;

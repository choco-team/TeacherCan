'use client';

import { useState } from 'react';
import ActivityCount from './create-routine/activity-count';
import RoutineForm from './create-routine/routine-form';
import { RoutineItem } from './create-routine/routine-types';
import PlayRoutine from './play-routine/play-routine';

function RoutineTimerContainer() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
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
  const handleStartRoutine = () => {
    setStep(3);
  };

  return (
    <div className="py-10 px-4 max-w-3xl mx-auto space-y-6">
      {step === 1 && <ActivityCount onNext={handleCountSubmit} />}
      {step === 2 && (
        <RoutineForm
          routines={routines}
          setRoutines={setRoutines}
          onPrevious={handleGoBack}
          onStart={handleStartRoutine}
        />
      )}
      {step === 3 && (
        <PlayRoutine
          routines={routines}
          onFinish={() => {
            setStep(1);
          }}
        />
      )}
    </div>
  );
}

export default RoutineTimerContainer;

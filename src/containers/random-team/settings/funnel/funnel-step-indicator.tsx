// src/containers/random-team/settings/funnel/funnel-step-indicator.tsx

'use client';

import React from 'react';

const STEPS = ['학생 생성', '기본 설정', '고정 학생', '확인'];

type Props = {
  currentStep: number;
};

export default function FunnelStepIndicator({ currentStep }: Props) {
  return (
    <div className="flex items-center justify-between mb-2">
      {STEPS.map((label, idx) => {
        const stepNumber = idx + 1;
        const isActive = stepNumber === currentStep;
        const isDone = stepNumber < currentStep;

        return (
          <div key={label} className="flex flex-col items-center flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold
                ${
                  isActive
                    ? 'bg-black text-white'
                    : isDone
                      ? 'bg-gray-400 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}
            >
              {stepNumber}
            </div>
            <span
              className={`text-xs mt-1 ${
                isActive ? 'font-semibold text-black' : 'text-gray-500'
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

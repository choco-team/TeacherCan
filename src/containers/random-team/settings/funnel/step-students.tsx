// src/containers/random-team/settings/funnel/step-students.tsx

'use client';

import React, { useState, useCallback } from 'react';
import { Card } from '@/components/card';
import { Label } from '@/components/label';
import { Button } from '@/components/button';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { Heading1 } from '@/components/heading';

import SettingStudentName from '@/containers/random-pick/random-pick-list/random-pick-setting/setting-student-name/setting-student-name';
import SettingStudentNumber from '@/containers/random-pick/random-pick-list/random-pick-setting/setting-student-number/setting-student-number';
import StudentDataPicker from '@/components/student-data-picker';

type Props = {
  students: string[];
  onChangeStudents: (students: string[]) => void;
  onNext: () => void;
};

export default function StepStudents({
  students,
  onChangeStudents,
  onNext,
}: Props) {
  const [mode, setMode] = useState<'numbers' | 'names' | 'student-data'>(
    'numbers',
  );

  const handleGenerated = useCallback(
    (list: string[]) => {
      onChangeStudents(list);
    },
    [onChangeStudents],
  );

  const handleStudentDataImport = useCallback(
    (studentData: { name: string }[]) => {
      handleGenerated(studentData.map((s) => s.name));
    },
    [handleGenerated],
  );

  const canProceed = students.length > 0;

  return (
    <>
      <Heading1 className="text-xl font-bold">1단계 · 학생 목록 생성</Heading1>

      <Card className="p-4 w-full">
        <Label className="mb-2 font-semibold text-sm">
          학생 목록 생성 방식
        </Label>

        <RadioGroup className="flex gap-x-4 mb-4">
          <Label className="flex items-center gap-x-2">
            <RadioGroupItem
              value="numbers"
              checked={mode === 'numbers'}
              onClick={() => setMode('numbers')}
            />
            번호로 구성
          </Label>

          <Label className="flex items-center gap-x-2">
            <RadioGroupItem
              value="names"
              checked={mode === 'names'}
              onClick={() => setMode('names')}
            />
            이름으로 구성
          </Label>

          <Label className="flex items-center gap-x-2">
            <RadioGroupItem
              value="student-data"
              checked={mode === 'student-data'}
              onClick={() => setMode('student-data')}
            />
            학생 데이터 불러오기
          </Label>
        </RadioGroup>

        {mode === 'names' && (
          <SettingStudentName
            onCreateRandomPick={(_, list) =>
              handleGenerated(list.map((i) => i.value))
            }
          />
        )}

        {mode === 'numbers' && (
          <SettingStudentNumber
            onCreateRandomPick={(_, list) =>
              handleGenerated(list.map((i) => i.value))
            }
          />
        )}

        {mode === 'student-data' && (
          <StudentDataPicker
            buttonText="불러오기"
            onClickButton={handleStudentDataImport}
          />
        )}
      </Card>

      <div className="flex justify-end">
        <Button variant="primary" disabled={!canProceed} onClick={onNext}>
          다음
        </Button>
      </div>
    </>
  );
}

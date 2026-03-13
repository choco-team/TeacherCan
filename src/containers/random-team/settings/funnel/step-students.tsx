'use client';

import React, { useState, useCallback } from 'react';
import { Card } from '@/components/card';
import { Label } from '@/components/label';
import { Button } from '@/components/button';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { Heading1 } from '@/components/heading';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const [mode, setMode] = useState<'numbers' | 'names' | 'student-data'>(
    'numbers',
  );

  const [showAllStudents, setShowAllStudents] = useState(false);

  const handleGenerated = useCallback(
    (list: string[]) => {
      onChangeStudents(list);

      toast({
        title: '학생 명단이 구성되었습니다.',
        description: `${list.length}명이 등록되었습니다.`,
        variant: 'success',
      });
    },
    [onChangeStudents, toast],
  );

  const handleStudentDataImport = useCallback(
    (studentData: { name: string }[]) => {
      handleGenerated(studentData.map((s) => s.name));
    },
    [handleGenerated],
  );

  const canProceed = students.length > 0;

  const previewCount = 6;
  const previewStudents = showAllStudents
    ? students
    : students.slice(0, previewCount);

  const hiddenCount = students.length - previewCount;

  return (
    <>
      <Heading1 className="text-xl font-bold">1단계 · 학생 목록 생성</Heading1>

      {students.length > 0 && (
        <Card className="p-4 w-full flex flex-col gap-2">
          <Label className="font-semibold text-sm">
            현재 학생 명단 ({students.length}명)
          </Label>

          <div className="flex flex-wrap gap-2 text-sm">
            {previewStudents.map((name) => (
              <span
                key={name}
                className="px-2 py-1 bg-gray-100 rounded text-xs"
              >
                {name}
              </span>
            ))}
          </div>

          {!showAllStudents && hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAllStudents(true)}
              className="text-xs text-blue-600 hover:underline w-fit"
            >
              +{hiddenCount}명 더 보기
            </button>
          )}
        </Card>
      )}

      <Card className="p-4 w-full">
        <Label className="font-semibold text-sm">
          {students.length > 0 ? '학생 목록 수정하기' : '학생 목록 생성하기'}
        </Label>

        <RadioGroup className="flex gap-x-4 mb-4 mt-2">
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

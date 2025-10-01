'use client';

import { Button } from '@/components/button';
import { Label } from '@radix-ui/react-label';
import React, { useState } from 'react';
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastViewport,
} from '@/components/toast';
import { Input } from '@/components/input';
import { Heading1 } from '@/components/heading';
import StudentDataPicker from '@/components/student-data-picker';
import TeamResult from '../team-result/team-result';

export type Mode = 'numbers' | 'names' | 'studentData';

export type TeamSetupProps = {
  onProceed?: (payload: {
    mode: Mode;
    students: string[];
    groupCount: number;
  }) => void;
};

export default function TeamSetup({ onProceed }: TeamSetupProps) {
  const [mode, setMode] = useState<Mode>('numbers');
  const [studentCountInput, setStudentCountInput] = useState<number | ''>('');
  const [nameTextarea, setNameTextarea] = useState('');
  const [students, setStudents] = useState<string[]>([]);
  const [groupCountInput, setGroupCountInput] = useState<number | ''>('');
  const [proceedPayload, setProceedPayload] = useState<{
    students: string[];
    groupCount: number;
  } | null>(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>(
    'success',
  );
  const [toastMessage, setToastMessage] = useState('');

  const parseNames = (text: string) =>
    text
      .split(/[,\n;]+/)
      .map((s) => s.trim())
      .filter(Boolean);

  const generateFromCount = () => {
    if (!studentCountInput || Number(studentCountInput) < 1) {
      setToastVariant('error');
      setToastMessage('학생 수를 1 이상 입력하세요.');
      setToastOpen(true);
      return;
    }
    const n = Number(studentCountInput);
    const arr = Array.from({ length: n }, (_, i) => String(i + 1));
    setStudents(arr);
    setToastVariant('success');
    setToastMessage('출석번호가 생성되었습니다.');
    setToastOpen(true);
  };

  const generateFromNames = () => {
    const arr = parseNames(nameTextarea);
    if (arr.length === 0) {
      setToastVariant('error');
      setToastMessage('이름을 한 명 이상 입력하세요.');
      setToastOpen(true);
      return;
    }
    setStudents(arr);
    setToastVariant('success');
    setToastMessage('이름 목록이 생성되었습니다.');
    setToastOpen(true);
  };

  const handleStudentDataImport = (
    studentData: { id: string; name: string }[],
  ) => {
    if (!studentData || studentData.length === 0) {
      setToastVariant('error');
      setToastMessage('가져올 학생 데이터가 없습니다.');
      setToastOpen(true);
      return;
    }
    const names = studentData.map((s) => s.name);
    setStudents(names);
    setToastVariant('success');
    setToastMessage('학생 데이터를 가져왔습니다.');
    setToastOpen(true);
  };

  const validForProceed = () => {
    const groupCount = Number(groupCountInput);
    return (
      students.length >= 1 && groupCount >= 1 && Number.isInteger(groupCount)
    );
  };

  const proceed = () => {
    if (!validForProceed()) {
      setToastVariant('error');
      setToastMessage('학생 목록과 모둠 수를 확인하세요.');
      setToastOpen(true);
      return;
    }

    const payload = {
      students,
      groupCount: Number(groupCountInput),
    };

    setProceedPayload(payload);
    if (onProceed) {
      onProceed({ mode, ...payload });
    }
  };

  return (
    <ToastProvider>
      <div className="max-w-3xl mx-auto p-4">
        <Heading1 className="text-2xl font-semibold mb-2">
          입력 (학생 목록 생성)
        </Heading1>

        {/* 모드 선택 버튼 3개 */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={mode === 'numbers' ? 'primary' : 'primary-outline'}
            className="px-4 py-2 rounded"
            onClick={() => setMode('numbers')}
          >
            숫자(출석번호) 모드
          </Button>

          <Button
            variant={mode === 'names' ? 'primary' : 'primary-outline'}
            className="px-4 py-2 rounded"
            onClick={() => setMode('names')}
          >
            이름 모드
          </Button>

          <Button
            variant={mode === 'studentData' ? 'primary' : 'primary-outline'}
            className="px-4 py-2 rounded"
            onClick={() => setMode('studentData')}
          >
            학생 데이터 모드
          </Button>
        </div>

        {/* 숫자 모드 */}
        {mode === 'numbers' && (
          <div className="mb-4">
            <Label className="block text-sm font-medium mb-1">학생 수</Label>
            <div className="mt-2 flex gap-2">
              <Input
                type="number"
                min={1}
                value={studentCountInput === '' ? '' : studentCountInput}
                onChange={(e) =>
                  setStudentCountInput(
                    e.target.value === '' ? '' : Number(e.target.value),
                  )
                }
                className="border rounded px-3 py-2 w-40 bg-gray-100"
                placeholder="예: 20"
              />
              <Button onClick={generateFromCount} variant="secondary">
                출석번호 생성
              </Button>
            </div>
          </div>
        )}

        {/* 이름 모드 */}
        {mode === 'names' && (
          <div className="mb-4">
            <Label className="block text-sm font-medium mb-1">
              학생 이름 (줄바꿈 또는 콤마로 구분)
            </Label>
            <textarea
              rows={6}
              value={nameTextarea}
              onChange={(e) => setNameTextarea(e.target.value)}
              className="w-full border rounded p-2 bg-gray-100"
              placeholder={'예: \n김철수\n이영희\n박민수,최지우'}
            />
            <div className="mt-2 flex gap-2">
              <Button onClick={generateFromNames} variant="secondary">
                이름 목록 생성
              </Button>
            </div>
          </div>
        )}

        {/* 학생 데이터 가져오기 모드 */}
        {mode === 'studentData' && (
          <div className="mb-4">
            <StudentDataPicker
              buttonText="학생 데이터 가져오기"
              onClickButton={handleStudentDataImport}
            />
          </div>
        )}

        {/* 모둠 수 입력 및 진행 */}
        <div className="mb-4">
          <Label className="block text-sm font-medium mb-1">모둠 수</Label>
          <div className="mt-2 flex gap-2">
            <Input
              type="number"
              min={1}
              value={groupCountInput === '' ? '' : groupCountInput}
              onChange={(e) =>
                setGroupCountInput(
                  e.target.value === '' ? '' : Number(e.target.value),
                )
              }
              className="border rounded px-3 py-2 w-40 bg-gray-100"
              placeholder="예: 4"
            />
            <Button
              onClick={proceed}
              variant="primary"
              disabled={!validForProceed()}
            >
              모둠 랜덤 배정하기
            </Button>
          </div>
        </div>

        {/* 결과 */}
        {proceedPayload && (
          <TeamResult
            students={proceedPayload.students}
            groupCount={proceedPayload.groupCount}
          />
        )}
      </div>

      <Toast
        open={toastOpen}
        onOpenChange={setToastOpen}
        variant={toastVariant}
      >
        <div className="flex flex-col gap-1">
          <ToastTitle>
            {toastVariant === 'success' ? '성공' : '오류'}
          </ToastTitle>
          <ToastDescription>{toastMessage}</ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/button';
import { Heading1 } from '@/components/heading';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/toast';
import TeamResult from '../team-result/team-result';
import TeamModeModal from '../team-mode-modal/team-mode-modal';

export type Mode = 'numbers' | 'names' | 'student-data';

export default function TeamSetup() {
  const [students, setStudents] = useState<string[]>([]);
  const [groupCount, setGroupCount] = useState<number | ''>('');
  const [toastOpen, setToastOpen] = useState(false);
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>(
    'success',
  );
  const [toastMessage, setToastMessage] = useState('');
  const [proceedPayload, setProceedPayload] = useState<{
    students: string[];
    groupCount: number;
  } | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  const handleStudentsGenerated = (newStudents: string[]) => {
    setStudents(newStudents);
    setToastVariant('success');
    setToastMessage('학생 목록이 생성되었습니다.');
    setToastOpen(true);
    setModalOpen(false);
  };

  const validForProceed = () =>
    students.length > 0 && groupCount !== '' && Number(groupCount) > 0;

  const handleProceed = () => {
    if (!validForProceed()) {
      setToastVariant('error');
      setToastMessage('학생 목록과 모둠 수를 확인하세요.');
      setToastOpen(true);
      return;
    }
    setProceedPayload({ students, groupCount: Number(groupCount) });
  };

  return (
    <ToastProvider>
      <div className="max-w-3xl mx-auto p-4">
        <Heading1 className="text-2xl font-semibold mb-2">
          랜덤 모둠 생성
        </Heading1>

        <div className="flex gap-2 mb-4">
          <Button onClick={() => setModalOpen(true)} variant="primary">
            학생 목록 만들기
          </Button>
        </div>

        {students.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              현재 {students.length}명의 학생이 있습니다.
            </p>
          </div>
        )}

        <div className="mb-4 flex gap-2">
          <input
            type="number"
            min={1}
            value={groupCount === '' ? '' : groupCount}
            onChange={(e) =>
              setGroupCount(e.target.value === '' ? '' : Number(e.target.value))
            }
            placeholder="모둠 수 입력"
            className="border rounded px-3 py-2 w-40 bg-gray-100"
          />
          <Button
            onClick={handleProceed}
            variant="primary"
            disabled={!validForProceed()}
          >
            모둠 랜덤 배정하기
          </Button>
        </div>

        {proceedPayload && (
          <TeamResult
            students={proceedPayload.students}
            groupCount={proceedPayload.groupCount}
          />
        )}
      </div>

      {/* 모달 */}
      {modalOpen && (
        <TeamModeModal
          onClose={() => setModalOpen(false)}
          onStudentsGenerated={handleStudentsGenerated}
        />
      )}

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

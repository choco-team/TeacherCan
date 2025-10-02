'use client';

import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/dialog';
import { Label } from '@/components/label';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { Button } from '@/components/button';
import StudentDataPicker from '@/components/student-data-picker';
// import { creatId } from '@/utils/createNanoid';
import { Student } from '@/containers/random-pick/random-pick-type';
import SettingStudentNumber from '@/containers/random-pick/random-pick-list/random-pick-setting/setting-student-number/setting-student-number';
import SettingStudentName from '@/containers/random-pick/random-pick-list/random-pick-setting/setting-student-name/setting-student-name';

type Props = {
  onClose: () => void;
  onStudentsGenerated: (students: string[]) => void;
};

export default function TeamModeModal({ onClose, onStudentsGenerated }: Props) {
  const [mode, setMode] = useState<'numbers' | 'names' | 'student-data'>(
    'numbers',
  );

  const handleStudentDataImport = useCallback(
    (studentData: Student[]) => {
      const names = studentData.map((s) => s.name);
      onStudentsGenerated(names);
    },
    [onStudentsGenerated],
  );

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>학생 목록 생성 방식 선택</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-y-4">
          <RadioGroup className="flex gap-x-4">
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
                onStudentsGenerated(list.map((i) => i.value))
              }
            />
          )}

          {mode === 'numbers' && (
            <SettingStudentNumber
              onCreateRandomPick={(_, list) =>
                onStudentsGenerated(list.map((i) => i.value))
              }
            />
          )}

          {mode === 'student-data' && (
            <StudentDataPicker
              buttonText="불러오기"
              onClickButton={handleStudentDataImport}
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

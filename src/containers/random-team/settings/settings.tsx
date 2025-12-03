'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Label } from '@/components/label';
import { X } from 'lucide-react';
import {
  ToastProvider,
  Toast,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/toast';
import SettingStudentName from '@/containers/random-pick/random-pick-list/random-pick-setting/setting-student-name/setting-student-name';
import SettingStudentNumber from '@/containers/random-pick/random-pick-list/random-pick-setting/setting-student-number/setting-student-number';
import StudentDataPicker from '@/components/student-data-picker';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { Input } from '@/components/input';
import { Heading3 } from '@/components/heading';

type Team = {
  id: string;
};

export default function SettingsContainer({
  settingsId,
}: {
  settingsId: string;
}) {
  const router = useRouter();

  const [mode, setMode] = useState<'numbers' | 'names' | 'student-data'>(
    'numbers',
  );
  const [students, setStudents] = useState<string[]>([]);
  const [teamCount, setTeamCount] = useState<number>(4);
  const [teams, setTeams] = useState<Team[]>(() =>
    Array.from({ length: teamCount }, () => ({ id: crypto.randomUUID() })),
  );
  const [fixedAssignments, setFixedAssignments] = useState<
    Record<string, string[]>
  >({});
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setTeams(
      Array.from({ length: teamCount }, (_, i) => ({
        id: teams[i]?.id ?? crypto.randomUUID(),
      })),
    );
  }, [teamCount]);

  useEffect(() => {
    const saved = localStorage.getItem('randomTeamSettings');
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (parsed.students) setStudents(parsed.students);
      if (parsed.teamCount) setTeamCount(parsed.teamCount);
      if (parsed.fixedAssignments) setFixedAssignments(parsed.fixedAssignments);
    } catch (e) {
      console.error('Failed to parse saved settings', e);
    }
  }, []);

  const handleGenerated = useCallback((list: string[]) => {
    setStudents(list);
    setFixedAssignments({});
  }, []);

  const handleStudentDataImport = useCallback(
    (studentData: { name: string }[]) => {
      const names = studentData.map((s) => s.name);
      handleGenerated(names);
    },
    [handleGenerated],
  );

  const assigned = useMemo(
    () => Object.values(fixedAssignments).flat(),
    [fixedAssignments],
  );
  const unassignedStudents = useMemo(
    () => students.filter((s) => !assigned.includes(s)),
    [students, assigned],
  );
  const maxSize = Math.ceil(students.length / teamCount);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    student: string,
  ) => {
    e.dataTransfer.setData('text/plain', student);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, teamId: string) => {
    e.preventDefault();
    const student = e.dataTransfer.getData('text/plain');
    if (!student || assigned.includes(student)) return;
    if ((fixedAssignments[teamId]?.length ?? 0) >= maxSize) return;

    setFixedAssignments((prev) => ({
      ...prev,
      [teamId]: [...(prev[teamId] ?? []), student],
    }));
  };

  const handleRemoveFixed = (teamId: string, student: string) => {
    setFixedAssignments((prev) => ({
      ...prev,
      [teamId]: prev[teamId].filter((s) => s !== student),
    }));
  };

  const handleSaveSettings = () => {
    const data = { students, teamCount, fixedAssignments };
    localStorage.setItem('randomTeamSettings', JSON.stringify(data));
    setShowToast(true);
  };

  const handleFinish = () => {
    handleSaveSettings();
    router.push('/random-team');
  };

  return (
    <ToastProvider>
      <div className="p-4 max-w-xl mx-auto flex flex-col gap-6">
        <h1 className="text-xl font-bold">모둠 설정 ({settingsId})</h1>

        <Card className="p-4">
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

        <Card className="p-4">
          <Label className="mb-2 font-semibold text-sm">모둠 수</Label>
          <Input
            type="number"
            min={1}
            value={teamCount}
            onChange={(e) => setTeamCount(Number(e.target.value))}
            className="border p-2 rounded w-24"
          />
        </Card>

        <Card className="p-4">
          <Label className="mb-2 font-semibold text-sm">고정 학생 설정</Label>
          <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto mb-2">
            {unassignedStudents.map((student) => (
              <div
                key={student}
                draggable
                onDragStart={(e) => handleDragStart(e, student)}
                className="px-2 py-[2px] bg-white border rounded text-xs cursor-grab hover:bg-gray-100"
              >
                {student}
              </div>
            ))}
            {unassignedStudents.length === 0 && (
              <p className="text-xs text-gray-500">남은 학생 없음</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {teams.map((team, idx) => (
              <Card
                key={team.id}
                className={`p-1 border-dashed border-2 min-h-[100px] ${fixedAssignments[team.id]?.length >= maxSize ? 'opacity-50' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, team.id)}
              >
                <Heading3 className="font-semibold mb-1 text-center text-sm">
                  모둠 {idx + 1}
                </Heading3>
                <div className="flex flex-wrap justify-center gap-1 max-h-28 overflow-y-auto">
                  {(fixedAssignments[team.id] ?? []).map((student) => (
                    <div
                      key={student}
                      className="flex items-center gap-1 px-1 py-[2px] bg-white border rounded text-xs"
                    >
                      <span className="truncate max-w-[70px]">{student}</span>
                      <Button
                        variant="gray-ghost"
                        size="sm"
                        onClick={() => handleRemoveFixed(team.id, student)}
                        className="p-0"
                      >
                        <X className="w-3 h-3 text-gray-500 hover:text-black" />
                      </Button>
                    </div>
                  ))}
                  {(fixedAssignments[team.id] ?? []).length === 0 && (
                    <p className="text-xs text-gray-500 w-full text-center mt-1">
                      학생 없음
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Card>

        <Button variant="primary" onClick={handleFinish}>
          저장 후 랜덤팀으로 이동
        </Button>

        <ToastViewport />
        {showToast && (
          <Toast open={showToast} onOpenChange={setShowToast} variant="success">
            <ToastTitle>설정 저장 완료</ToastTitle>
            <ToastDescription>모둠 설정이 저장되었습니다.</ToastDescription>
            <ToastClose />
          </Toast>
        )}
      </div>
    </ToastProvider>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Shuffle, Settings, UserPen, X, Plus } from 'lucide-react';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Heading1 } from '@/components/heading';

import TeamResult from '@/containers/random-team/team-result/team-result';
import { useRandomTeamSettings } from './hooks/useRandomTeamStorage';

export default function RandomTeamContainer() {
  const [mounted, setMounted] = useState(false);

  const [settings, setRandomTeamSettings] = useRandomTeamSettings();

  const [showResult, setShowResult] = useState(false);
  const assignRef = useRef<() => void>();

  // 학생 편집 모달 관련 상태
  const [showEditStudents, setShowEditStudents] = useState(false);
  const [editStudentNames, setEditStudentNames] = useState<string[]>([]);
  const [editStudentInput, setEditStudentInput] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAssignTeams = () => {
    setShowResult(true);
    assignRef.current?.();
  };

  if (!mounted) {
    return null;
  }

  const hasSettings =
    settings &&
    Array.isArray(settings.students) &&
    settings.students.length > 0;

  const isReady = hasSettings && typeof settings.teamCount === 'number';

  const openEditStudents = () => {
    if (!settings?.students) return;
    setEditStudentNames([...settings.students]);
    setEditStudentInput('');
    setShowEditStudents(true);
  };

  const handleEditAddStudent = () => {
    const name = editStudentInput.trim();
    if (name && !editStudentNames.includes(name)) {
      setEditStudentNames((prev) => [...prev, name]);
      setEditStudentInput('');
    }
  };

  const handleEditAddBulk = () => {
    const names = editStudentInput
      .split(/[,\n]/)
      .map((name) => name.trim())
      .filter((name) => name && !editStudentNames.includes(name));

    if (names.length > 0) {
      setEditStudentNames((prev) => [...prev, ...names]);
      setEditStudentInput('');
    }
  };

  const handleEditRemoveStudent = (nameToRemove: string) => {
    setEditStudentNames((prev) => prev.filter((name) => name !== nameToRemove));
  };

  const handleEditComplete = () => {
    if (!settings) return;

    const updatedStudents = editStudentNames;
    const updatedPreAssignments = settings.preAssignments.filter((item) =>
      updatedStudents.includes(item.student),
    );

    setRandomTeamSettings({
      ...settings,
      students: updatedStudents,
      preAssignments: updatedPreAssignments,
    });

    setShowEditStudents(false);
    setShowResult(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
      <Card className="p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Heading1 className="text-xl font-bold">랜덤 모둠 구성</Heading1>

          <div className="flex items-center gap-2">
            {isReady && (
              <Button
                onClick={openEditStudents}
                variant="primary"
                size="sm"
                className="flex items-center gap-2 px-4 hover:shadow-md transition-all"
              >
                <UserPen className="h-4 w-4" />
                학생 편집
              </Button>
            )}

            <Link href="/random-team/settings/1">
              <Button
                variant="primary"
                size="sm"
                className="flex items-center gap-2 px-4 hover:shadow-md transition-all"
              >
                <Settings className="w-4 h-4" />
                {hasSettings ? '수정하기' : '시작하기'}
              </Button>
            </Link>
          </div>
        </div>

        {isReady && (
          <div className="text-sm text-muted-foreground space-y-1 bg-gray-50 p-3 rounded border max-w-5xl">
            <p>학생 수: {settings.students.length}명</p>
            <p>모둠 수: {settings.teamCount}개</p>
            <p>고정 배정: {settings.preAssignments?.length ?? 0}명</p>
          </div>
        )}

        {isReady && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleAssignTeams}
            className="flex items-center gap-2 w-fit"
          >
            <Shuffle className="w-4 h-4" />
            {showResult ? '모둠 재배정' : '랜덤 모둠 뽑기'}
          </Button>
        )}
      </Card>

      {showResult && isReady && (
        <div className="animate-fade-in">
          <TeamResult
            students={settings.students}
            teamCount={settings.teamCount}
            preAssignments={settings.preAssignments}
            assignRef={assignRef}
            showFixedMark={settings.showFixedMark}
          />
        </div>
      )}

      {showEditStudents && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm"
          onClick={() => setShowEditStudents(false)}
        >
          <div
            className="mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">학생 편집</h3>
              <button
                onClick={() => setShowEditStudents(false)}
                className="rounded-full p-1 transition-colors hover:bg-secondary"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <p className="mb-4 text-sm text-muted-foreground">
              학생을 추가하거나 삭제할 수 있어요. 쉼표(,)로 여러 명을 한번에
              추가할 수 있어요.
            </p>

            {/* 입력 영역 */}
            <div className="mb-3 flex gap-2">
              <input
                type="text"
                value={editStudentInput}
                onChange={(event) => setEditStudentInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    if (editStudentInput.includes(',')) {
                      handleEditAddBulk();
                    } else {
                      handleEditAddStudent();
                    }
                  }
                }}
                placeholder="학생 이름"
                className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                onClick={() => {
                  if (editStudentInput.includes(',')) {
                    handleEditAddBulk();
                  } else {
                    handleEditAddStudent();
                  }
                }}
                variant="primary"
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* 학생 명단 태그 리스트 */}
            {editStudentNames.length > 0 && (
              <div className="mb-4 max-h-[240px] overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {editStudentNames.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-sm text-primary"
                    >
                      {name}
                      <button
                        onClick={() => handleEditRemoveStudent(name)}
                        className="transition-colors hover:text-destructive"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  총 {editStudentNames.length}명
                </p>
              </div>
            )}

            {/* 하단 제어 버튼 */}
            <div className="flex gap-2">
              <Button
                onClick={() => setShowEditStudents(false)}
                variant="primary"
                className="px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
              >
                취소
              </Button>
              <Button
                onClick={handleEditComplete}
                disabled={editStudentNames.length === 0}
                variant="primary"
                className="flex-1 py-3 font-medium text-primary-foreground hover:opacity-90"
              >
                저장 ({editStudentNames.length}명)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

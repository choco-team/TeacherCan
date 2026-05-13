'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Presentation,
  RotateCcw,
  Trash2,
  UserPen,
  X,
} from 'lucide-react';
import DecorationPopup from '@/containers/presentation-assistant/decoration-popup';
import SetupPage from '@/containers/presentation-assistant/setup-page';
import StatsBar from '@/containers/presentation-assistant/stats-bar';
import StudentCard from '@/containers/presentation-assistant/student-card';
import {
  addPresentation,
  deletePresentation,
  loadPresentations,
  updatePresentation,
} from '@/lib/presentation-assistant-storage';
import {
  PresentationClassInfo,
  PresentationStudent,
  SavedPresentation,
} from '@/types/presentation-assistant';

export default function PresentationAssistantPage() {
  const [presentations, setPresentations] = useState<SavedPresentation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [students, setStudents] = useState<PresentationStudent[]>([]);
  const [showEditStudents, setShowEditStudents] = useState(false);
  const [editStudentNames, setEditStudentNames] = useState<string[]>([]);
  const [editStudentInput, setEditStudentInput] = useState('');
  const [decoratingStudent, setDecoratingStudent] =
    useState<PresentationStudent | null>(null);

  useEffect(() => {
    setPresentations(loadPresentations());
  }, []);

  const activePresentation =
    presentations.find((presentation) => presentation.id === activeId) || null;

  useEffect(() => {
    if (activePresentation && students.length > 0) {
      const updated = { ...activePresentation, students };
      updatePresentation(updated);
      setPresentations((prev) =>
        prev.map((presentation) =>
          presentation.id === updated.id ? updated : presentation,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students]);

  const handleSetupComplete = (info: PresentationClassInfo) => {
    const newPresentation: SavedPresentation = {
      id: crypto.randomUUID(),
      title: info.title,
      students: info.students,
      createdAt: new Date().toLocaleDateString('ko-KR'),
    };

    addPresentation(newPresentation);
    setPresentations((prev) => [newPresentation, ...prev]);
    setShowSetup(false);
    setActiveId(newPresentation.id);
    setStudents(newPresentation.students);
  };

  const openPresentation = (presentation: SavedPresentation) => {
    setActiveId(presentation.id);
    setStudents(presentation.students);
  };

  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    deletePresentation(id);
    setPresentations((prev) =>
      prev.filter((presentation) => presentation.id !== id),
    );
  };

  const handleBack = () => {
    setActiveId(null);
    setPresentations(loadPresentations());
  };

  const handleReset = () => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, count: 0, decoration: undefined })),
    );
  };

  const handleCardClick = useCallback((student: PresentationStudent) => {
    setStudents((prev) =>
      prev.map((current) =>
        current.id === student.id
          ? { ...current, count: current.count + 1 }
          : current,
      ),
    );
  }, []);

  const handleDecorationSelect = (decoration: string) => {
    if (!decoratingStudent) return;

    setStudents((prev) =>
      prev.map((student) =>
        student.id === decoratingStudent.id
          ? { ...student, count: student.count + 1, decoration }
          : student,
      ),
    );
    setDecoratingStudent(null);
  };

  const openEditStudents = () => {
    setEditStudentNames(students.map((student) => student.fullName));
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
    const existingMap = new Map(
      students.map((student) => [student.fullName, student]),
    );
    const maxId = students.reduce(
      (max, student) => Math.max(max, student.id),
      0,
    );
    let nextId = maxId + 1;

    const updatedStudents: PresentationStudent[] = editStudentNames.map(
      (name) => {
        const existing = existingMap.get(name);
        if (existing) return existing;
        const assignedId = nextId;
        nextId += 1;
        return {
          id: assignedId,
          nickname: name.length >= 2 ? name.slice(0, 2) : name,
          fullName: name,
          count: 0,
        };
      },
    );

    setStudents(updatedStudents);
    setShowEditStudents(false);
  };

  if (activeId && activePresentation) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={handleBack}
              className="rounded-lg p-2 transition-colors hover:bg-primary-300"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <h1 className="flex-1 text-xl font-bold text-foreground">
              {activePresentation.title}
            </h1>
            <button
              onClick={openEditStudents}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 active:scale-95"
            >
              <UserPen className="h-4 w-4" />
              학생 편집
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
              초기화
            </button>
          </div>

          <div className="mb-6">
            <StatsBar students={students} />
          </div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onClick={() => handleCardClick(student)}
                onDecorate={() => setDecoratingStudent(student)}
              />
            ))}
          </div>

          {decoratingStudent && (
            <DecorationPopup
              studentName={decoratingStudent.fullName}
              onSelect={handleDecorationSelect}
              onClose={() => setDecoratingStudent(null)}
            />
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
                  <h3 className="text-lg font-bold text-foreground">
                    학생 편집
                  </h3>
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

                <div className="mb-3 flex gap-2">
                  <input
                    type="text"
                    value={editStudentInput}
                    onChange={(event) =>
                      setEditStudentInput(event.target.value)
                    }
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
                  <button
                    onClick={() => {
                      if (editStudentInput.includes(',')) {
                        handleEditAddBulk();
                      } else {
                        handleEditAddStudent();
                      }
                    }}
                    className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

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

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowEditStudents(false)}
                    className="rounded-xl border border-border px-6 py-3 font-medium text-foreground transition-colors hover:bg-gray-200"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleEditComplete}
                    disabled={editStudentNames.length === 0}
                    className="flex-1 rounded-xl bg-primary py-3 font-medium text-primary-foreground transition-opacity disabled:opacity-40 hover:opacity-90"
                  >
                    저장 ({editStudentNames.length}명)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Presentation className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">
            발표 도우미
          </h1>
          <p className="text-sm text-muted-foreground">
            학생 발표 횟수를 간편하게 관리하세요.
          </p>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">발표 목록</h2>
          <button
            onClick={() => setShowSetup(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            새로 만들기
          </button>
        </div>

        {presentations.length === 0 ? (
          <div className="py-20 text-center text-sm text-muted-foreground">
            아직 발표가 없어요! 새로 만들어 보세요.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {presentations.map((presentation) => (
              <button
                key={presentation.id}
                onClick={() => openPresentation(presentation)}
                className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <div>
                  <p className="font-bold text-foreground">
                    {presentation.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {presentation.students.length}명 · {presentation.createdAt}
                  </p>
                </div>
                <button
                  onClick={(event) => handleDelete(presentation.id, event)}
                  className="rounded-lg p-2 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </button>
            ))}
          </div>
        )}
      </div>

      {showSetup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm"
          onClick={() => setShowSetup(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <SetupPage
              onComplete={handleSetupComplete}
              onClose={() => setShowSetup(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { KeyboardEvent, useEffect, useMemo, useState } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Trash2, Edit2, Plus, Check, X, FolderOpen } from 'lucide-react';
import { Heading1 } from '@/components/heading';

interface Student {
  id: string;
  name: string;
}

interface StudentSet {
  id: string;
  name: string;
  students: Student[];
}

const MAX_SET_COUNT = 10;
const DEFAULT_SET_NAME = '이름없는 학생 목록';

const createId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function StudentDataContainer() {
  const [legacyStudentData, setLegacyStudentData] = useLocalStorage<Student[]>(
    'student-data',
    [],
  );
  const [studentSets, setStudentSets] = useLocalStorage<StudentSet[]>(
    'student-data-sets',
    [],
  );
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);

  const [newSetName, setNewSetName] = useState('');
  const [editingSetId, setEditingSetId] = useState<string | null>(null);
  const [editingSetName, setEditingSetName] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    if (studentSets.length > 0) return;
    if (typeof window === 'undefined') return;

    // 이미 저장된 명단이 있으면 초기 명단을 다시 만들지 않는다.
    const savedSets = window.localStorage.getItem('student-data-sets');
    if (savedSets) {
      try {
        const parsed = JSON.parse(savedSets) as StudentSet[];
        if (Array.isArray(parsed) && parsed.length > 0) return;
      } catch {
        // 파싱 실패 시에만 초기 명단 생성 로직으로 진행
      }
    }

    const initialSet: StudentSet = {
      id: createId(),
      name: DEFAULT_SET_NAME,
      students: legacyStudentData ?? [],
    };
    setStudentSets([initialSet]);
  }, [legacyStudentData, setStudentSets, studentSets.length]);

  const selectedSet = useMemo(() => {
    if (studentSets.length === 0) return null;
    if (!selectedSetId) return studentSets[0];
    return (
      studentSets.find((set) => set.id === selectedSetId) ?? studentSets[0]
    );
  }, [selectedSetId, studentSets]);

  useEffect(() => {
    if (!selectedSet) return;
    setLegacyStudentData(selectedSet.students);
  }, [selectedSet, setLegacyStudentData]);

  const updateSelectedSet = (updater: (target: StudentSet) => StudentSet) => {
    if (!selectedSet) return;

    setStudentSets(
      studentSets.map((set) =>
        set.id === selectedSet.id ? updater(set) : set,
      ),
    );
  };

  const handleAddSet = () => {
    const trimmedName = newSetName.trim();
    if (!trimmedName || studentSets.length >= MAX_SET_COUNT) return;

    const nextSet: StudentSet = {
      id: createId(),
      name: trimmedName,
      students: [],
    };

    setStudentSets([...studentSets, nextSet]);
    setSelectedSetId(nextSet.id);
    setNewSetName('');
  };

  const handleStartSetEdit = (setItem: StudentSet) => {
    setEditingSetId(setItem.id);
    setEditingSetName(setItem.name);
  };

  const handleSaveSetEdit = () => {
    const trimmedName = editingSetName.trim();
    if (!editingSetId || !trimmedName) return;

    setStudentSets(
      studentSets.map((set) =>
        set.id === editingSetId ? { ...set, name: trimmedName } : set,
      ),
    );
    setEditingSetId(null);
    setEditingSetName('');
  };

  const handleDeleteSet = (setId: string) => {
    if (studentSets.length <= 1) return;

    const nextSets = studentSets.filter((set) => set.id !== setId);
    setStudentSets(nextSets);

    if (selectedSetId === setId) {
      setSelectedSetId(nextSets[0]?.id ?? null);
    }
  };

  const handleAddStudent = () => {
    const trimmedName = newStudentName.trim();
    if (!trimmedName || !selectedSet) return;

    const newStudent: Student = {
      id: createId(),
      name: trimmedName,
    };
    updateSelectedSet((set) => ({
      ...set,
      students: [...set.students, newStudent],
    }));
    setNewStudentName('');
  };

  const handleStartEdit = (student: Student) => {
    setEditingId(student.id);
    setEditingName(student.name);
  };

  const handleSaveEdit = () => {
    const trimmedName = editingName.trim();
    if (!trimmedName || !editingId || !selectedSet) return;

    updateSelectedSet((set) => ({
      ...set,
      students: set.students.map((student) =>
        student.id === editingId ? { ...student, name: trimmedName } : student,
      ),
    }));
    setEditingId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleDeleteStudent = (id: string) => {
    if (!selectedSet) return;
    updateSelectedSet((set) => ({
      ...set,
      students: set.students.filter((student) => student.id !== id),
    }));
  };

  const handleStudentKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (editingId) {
        handleSaveEdit();
      } else {
        handleAddStudent();
      }
    }
  };

  const handleSetKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (editingSetId) {
        handleSaveSetEdit();
      } else {
        handleAddSet();
      }
    }
  };

  const currentStudents = selectedSet?.students ?? [];

  return (
    <div className="w-full p-6">
      <div className="mb-8">
        <Heading1>학생 데이터 관리</Heading1>
        <p className="text-text-description mt-2">
          학생 명단을 최대 10개까지 관리할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[600px_1fr] gap-6 items-start">
        <section className="lg:sticky lg:top-6">
          <div className="mb-4">
            <h2 className="flex items-center gap-2 text-text-title font-semibold">
              <FolderOpen className="w-4 h-4" />
              학생 명단 ({studentSets.length}/{MAX_SET_COUNT})
            </h2>
            <p className="text-xs text-text-subtitle mt-1">
              수업별로 명단을 나눠 저장하고 선택해서 사용할 수 있습니다.
            </p>
          </div>

          <div className="flex gap-2 mb-3">
            <Input
              value={newSetName}
              onChange={(e) => setNewSetName(e.target.value)}
              onKeyDown={handleSetKeyDown}
              placeholder="새 명단 이름을 입력하세요"
              className="flex-1"
            />
            <Button
              onClick={handleAddSet}
              disabled={
                !newSetName.trim() || studentSets.length >= MAX_SET_COUNT
              }
            >
              명단 추가
            </Button>
          </div>

          <div className="divide-y border-y border-border">
            {studentSets.map((set) => {
              const isSelected = selectedSet?.id === set.id;
              const isEditing = editingSetId === set.id;

              return (
                <div
                  key={set.id}
                  className={`flex items-center justify-between h-14 py-2 px-2 transition-colors ${
                    isSelected ? 'bg-gray-100 dark:bg-gray-800/70' : ''
                  }`}
                >
                  {isEditing ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editingSetName}
                        onChange={(e) => setEditingSetName(e.target.value)}
                        onKeyDown={handleSetKeyDown}
                        className="flex-1"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={handleSaveSetEdit}
                        disabled={!editingSetName.trim()}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="gray-outline"
                        onClick={() => {
                          setEditingSetId(null);
                          setEditingSetName('');
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedSetId(set.id)}
                        className="flex items-center gap-2 text-left w-full"
                      >
                        <span
                          className={`text-base ${
                            isSelected
                              ? 'text-text-title font-medium'
                              : 'text-text-subtitle'
                          }`}
                        >
                          {set.name}
                        </span>
                        <span className="text-xs text-text-subtitle">
                          {set.students.length}명
                        </span>
                      </button>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary-outline"
                          onClick={() => handleStartSetEdit(set)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="gray-outline"
                          onClick={() => handleDeleteSet(set.id)}
                          disabled={studentSets.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {studentSets.length >= MAX_SET_COUNT && (
            <p className="text-xs text-text-subtitle mt-3">
              명단은 최대 {MAX_SET_COUNT}개까지 생성할 수 있습니다.
            </p>
          )}
        </section>

        <div>
          <Card className="mb-6 shadow-none">
            <CardHeader className="text-text-title">
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>
                  새 학생 추가 ({selectedSet?.name ?? DEFAULT_SET_NAME})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  onKeyDown={handleStudentKeyDown}
                  placeholder="학생 이름을 입력하세요"
                  className="flex-1"
                />
                <Button
                  onClick={handleAddStudent}
                  disabled={!newStudentName.trim() || !selectedSet}
                >
                  추가
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="text-text-title shadow-none">
            <CardHeader>
              <CardTitle>학생 목록 ({currentStudents.length}명)</CardTitle>
            </CardHeader>
            <CardContent>
              {currentStudents.length === 0 ? (
                <div className="text-center py-8 text-text-subtitle text-sm">
                  등록된 학생이 없습니다. 위에서 새 학생을 추가해보세요.
                </div>
              ) : (
                <div className="space-y-2">
                  {currentStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between h-14 py-2 px-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      {editingId === student.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={handleStudentKeyDown}
                            className="flex-1"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={handleSaveEdit}
                            disabled={!editingName.trim()}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="gray-outline"
                            onClick={handleCancelEdit}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="text-lg">{student.name}</span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="secondary-outline"
                              onClick={() => handleStartEdit(student)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="gray-outline"
                              onClick={() => handleDeleteStudent(student.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

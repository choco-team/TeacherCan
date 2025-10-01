'use client';

import { useState } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Trash2, Edit2, Plus, Check, X } from 'lucide-react';
import { Skeleton } from '@/components/skeleton';
import { Heading1 } from '@/components/heading';

interface Student {
  id: string;
  name: string;
}

export default function StudentDataContainer() {
  const [studentData, setStudentData] = useLocalStorage<Student[]>(
    'student-data',
    [],
  );
  const [newStudentName, setNewStudentName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAddStudent = () => {
    if (newStudentName.trim()) {
      const newStudent: Student = {
        id: Date.now().toString(),
        name: newStudentName.trim(),
      };
      setStudentData([...studentData, newStudent]);
      setNewStudentName('');
    }
  };

  const handleStartEdit = (student: Student) => {
    setEditingId(student.id);
    setEditingName(student.name);
  };

  const handleSaveEdit = () => {
    if (editingName.trim()) {
      setStudentData(
        studentData.map((student) =>
          student.id === editingId
            ? { ...student, name: editingName.trim() }
            : student,
        ),
      );
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleDeleteStudent = (id: string) => {
    setStudentData(studentData.filter((student) => student.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (editingId) {
        handleSaveEdit();
      } else {
        handleAddStudent();
      }
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-8">
        <Heading1>학생 데이터 관리</Heading1>
        <p className="text-text-description mt-2">
          학생 데이터를 추가, 수정, 삭제할 수 있습니다.
        </p>
      </div>

      <Card className="mb-6 shadow-none">
        <CardHeader className="text-text-title">
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-4 h-4" />새 학생 추가
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="학생 이름을 입력하세요"
              className="flex-1"
            />
            <Button
              onClick={handleAddStudent}
              disabled={!newStudentName.trim()}
            >
              추가
            </Button>
          </div>
        </CardContent>
      </Card>

      {!studentData ? (
        <Skeleton className="h-52 rounded-md" />
      ) : (
        <Card className="text-text-title shadow-none">
          <CardHeader>
            <CardTitle>학생 목록 ({studentData.length}명)</CardTitle>
          </CardHeader>
          <CardContent>
            {studentData.length === 0 ? (
              <div className="text-center py-8 text-text-subtitle text-sm">
                등록된 학생이 없습니다. 위에서 새 학생을 추가해보세요.
              </div>
            ) : (
              <div className="space-y-2">
                {studentData.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between h-14 py-2 px-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    {editingId === student.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyPress={handleKeyPress}
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
      )}
    </div>
  );
}

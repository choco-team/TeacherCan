'use client';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { fetchWithAuth } from '@/utils/api/fetchWithAuth';
import { useEffect, useState } from 'react';
import { Student } from '@/types/evaluation-prepare-types';
import ExcelUploader from './ExcelUploader';

export default function RegisterStudent() {
  const [students, setStudents] = useState<Student[]>([
    { name: null, number: null },
  ]);

  const [submitResult, setSubmitResult] = useState({
    success: false,
    message: '',
  });

  // 학생 추가 함수
  const addStudent = () => {
    const newStudent = {
      name: null,
      number: Number(students[students.length - 1].number) + 1,
    };
    setStudents([...students, newStudent]);
  };

  // 학생 삭제 함수
  const removeStudent = async (index) => {
    if (students.length > 1) {
      // 업데이트할 학생 배열 생성
      const updatedStudents = [...students];
      updatedStudents.splice(index, 1);

      // 상태 업데이트와 서버 요청을 함께 처리
      try {
        setStudents(updatedStudents);

        const response = await fetchWithAuth(`/student`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedStudents),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message);
        }

        setSubmitResult({
          success: true,
          message: '학생 삭제가 서버에 반영되었습니다.',
        });
      } catch (error) {
        setSubmitResult({
          success: false,
          message: `오류: ${error.message}`,
        });
      }
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index] = { ...updatedStudents[index], [field]: value };
    setStudents(updatedStudents);
  };

  const handleImportedData = (importedStudents: Student[]) => {
    setStudents((prevStudents) => {
      if (
        prevStudents.length === 1 &&
        !prevStudents[0].name &&
        !prevStudents[0].number
      ) {
        return importedStudents;
      }
      return [...prevStudents, ...importedStudents];
    });
  };

  // 업데이트 함수
  const fetchStudentList = async () => {
    setSubmitResult({ success: false, message: '' });
    try {
      const response = await fetchWithAuth(`/student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(students),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      setSubmitResult({
        success: true,
        message: '학생 명단이 서버 저장소에 반영되었습니다.',
      });
    } catch (error) {
      setSubmitResult({
        success: false,
        message: `오류: ${error.message}`,
      });
    }
  };

  const getStudentList = async () => {
    setSubmitResult({ success: false, message: '' });
    try {
      const response = await fetchWithAuth('/student');

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }
      setStudents(data);
    } catch (error) {
      setSubmitResult({
        success: false,
        message: `오류: ${error.message}`,
      });
    }
  };

  useEffect(() => {
    getStudentList();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">학생 명단 입력</h1>

      <div className="space-y-4">
        {students.map((student, index) => (
          <div className="grnumber grid-cols-1 sm:grid-cols-2 gap-3 flex">
            <div>
              <Input
                type="number"
                value={student.number}
                onChange={(e) =>
                  handleInputChange(index, 'number', e.target.value)
                }
                onBlur={fetchStudentList}
                placeholder="번호 입력"
              />
            </div>

            <div>
              <Input
                type="text"
                value={student.name}
                onChange={(e) =>
                  handleInputChange(index, 'name', e.target.value)
                }
                onBlur={fetchStudentList}
                placeholder="학생명 입력"
              />
            </div>
            <div>
              {students.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeStudent(index)}
                  size="sm"
                  variant="primary-outline"
                >
                  삭제
                </Button>
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-between">
          <Button
            onClick={addStudent}
            variant="primary-outline"
            className="flex items-center gap-x-1.5"
            onBlur={fetchStudentList}
          >
            학생 추가
          </Button>
          <ExcelUploader onDataImported={handleImportedData} />
        </div>
      </div>

      {submitResult.message && (
        <div
          className={`mt-4 p-2 rounded ${submitResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
          {submitResult.message}
        </div>
      )}
    </div>
  );
}

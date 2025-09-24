'use client';

import { Button } from '@/components/button';
import { Users } from 'lucide-react';
import { Student } from '@/containers/random-pick/random-pick-type';
import useLocalStorage from '@/hooks/useLocalStorage';

interface StudentDataSectionProps {
  buttonText?: string;
  onClickButton: (studentData: Student[]) => void;
}

export default function StudentDataPicker({
  buttonText = '확인',
  onClickButton,
}: StudentDataSectionProps) {
  const [studentData] = useLocalStorage<Student[]>('student-data', []);

  if (!studentData || studentData.length === 0) {
    return (
      <div className="space-y-3">
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-700 dark:text-yellow-300 text-center">
            학생 데이터가 없습니다. 먼저 학생 데이터를 추가해주세요.
          </p>
        </div>
        <div className="text-center">
          <a
            href="/data-service/student-data"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            <Users className="w-3 h-3" />
            학생 데이터 생성하러 가기
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
          총 {studentData.length}명의 학생 데이터를 가져올 수 있습니다
        </p>
      </div>
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200">
          학생 데이터 미리보기
        </h5>
        <div className="max-h-32 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
          <div className="flex flex-wrap gap-1">
            {studentData.slice(0, 10).map((student) => (
              <span
                key={student.id}
                className="inline-block px-2 py-1 text-xs bg-white dark:bg-gray-700 rounded border"
              >
                {student.name}
              </span>
            ))}
            {studentData.length > 10 && (
              <span className="inline-block px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded">
                +{studentData.length - 10}명 더
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Button
          onClick={() => {
            if (!studentData || studentData.length === 0) {
              return;
            }

            onClickButton(studentData);
          }}
          variant="primary"
          className="w-full"
        >
          {buttonText}
        </Button>
        <div className="text-center">
          <a
            href="/data-service/student-data"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            <Users className="w-3 h-3" />
            수정이 필요한 경우
          </a>
        </div>
      </div>
    </div>
  );
}

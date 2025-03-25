'use client';

import { Button } from '@/components/button';
import { fetchWithAuth } from '@/utils/api/fetchWithAuth';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function StudentPage() {
  const [studentNumber, setStudentNumber] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [answerFormat, setAnswerFormat] = useState({
    title: '',
    answerSheet: [],
  });
  const [answers, setAnswers] = useState([]);
  const [studentName, setStudentName] = useState<string | undefined>(undefined);
  const [studentList, setStudentList] = useState<
    { name: string; number: number }[]
  >([]);
  const [isStudentFixed, setIsStudentFixed] = useState(false);

  async function getStudentList(token) {
    try {
      const response = await fetchWithAuth(`/student/input?token=${token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setStudentList(data);
    } catch (error) {
      alert(error.message);
    }
  }

  async function getExamDatabyToken(token) {
    try {
      const response = await fetchWithAuth(`/question/answer?token=${token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '데이터를 불러오는데 실패했습니다.');
      }

      // 💡 클라이언트용 id를 answerSheet 항목에 추가
      const answerSheetWithIds = data.answerSheet.map((item) => ({
        ...item,
        id: uuidv4(),
      }));

      setAnswerFormat({
        ...data,
        answerSheet: answerSheetWithIds,
      });

      // 정답 배열 초기화
      const initialAnswers = answerSheetWithIds.map((item) => {
        if (item.format === 'select') {
          return Array(item.counts).fill('');
        }
        return '';
      });

      setAnswers(initialAnswers);
    } catch (error) {
      alert(error.message);
    }
  }

  const fixStudent = () => {
    setIsStudentFixed(true);
  };

  const handleInputChange = (questionIndex, value) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
  };

  const handleStudentNumber = (value) => {
    const numValue = Number(value);
    setStudentNumber(numValue);

    const selectedStudent = studentList.find(
      (student) => student.number === numValue,
    );

    // selectedStudent가 존재할 때만 name에 접근
    if (selectedStudent) {
      setStudentName(selectedStudent.name);
    } else {
      setStudentName(undefined);
    }
  };

  const handleSubmit = async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    const answerData = {
      token,
      student: studentNumber,
      answer: answers,
    };
    try {
      const response = await fetchWithAuth('/student/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answerData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      } else {
        alert('답안이 제출되었습니다.');
      }
    } catch (error) {
      alert(`답안 제출에 실패했습니다: ${error.message}`);
    }
  };

  const renderAnswerSheet = () => {
    if (!isClient) return null;

    return answerFormat.answerSheet.map((item, questionIndex) => {
      const key = item.id;

      if (item.format === 'select') {
        return (
          <div key={key} className="mb-6">
            <h3 className="text-lg font-medium mb-2">
              문제 {questionIndex + 1} (객관식)
            </h3>
            <div className="flex items-center">
              <label htmlFor={key} className="mr-2">
                답변
              </label>
              <select
                id={key}
                className="border rounded p-2 w-full max-w-xs"
                value={answers[questionIndex] || ''}
                onChange={(e) =>
                  handleInputChange(questionIndex, e.target.value)
                }
              >
                <option value="">선택</option>
                {Array.from({ length: item.counts }).map((_, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <option key={`option-${item.id}-${i}`} value={String(i + 1)}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      }
      if (item.format === 'input') {
        return (
          <div key={key} className="mb-6">
            <h3 className="text-lg font-medium mb-2">
              문제 {questionIndex + 1} (단답형)
            </h3>
            <input
              type="text"
              className="border rounded p-2 w-full"
              value={answers[questionIndex] || ''}
              onChange={(e) => handleInputChange(questionIndex, e.target.value)}
              placeholder="답을 입력하세요"
            />
          </div>
        );
      }
      if (item.format === 'textarea') {
        return (
          <div key={key} className="mb-6">
            <h3 className="text-lg font-medium mb-2">
              문제 {questionIndex + 1} (서술형)
            </h3>
            <textarea
              className="border rounded p-2 w-full h-32"
              value={answers[questionIndex] || ''}
              onChange={(e) => handleInputChange(questionIndex, e.target.value)}
              placeholder="답을 입력하세요"
            />
          </div>
        );
      }

      return null;
    });
  };

  useEffect(() => {
    setIsClient(true);
    // URL에서 쿼리 파라미터 가져오기
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      getExamDatabyToken(token);
      getStudentList(token);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isClient ? answerFormat.title : ''}
      </h1>

      {isClient && answerFormat.answerSheet.length > 0 ? (
        <form>
          <h3 className="text-lg font-medium mb-2">출석번호 입력</h3>
          <div className="flex items-center">
            <input
              className="border rounded p-2 w-20"
              type="number"
              value={studentNumber}
              readOnly={isStudentFixed}
              onChange={(e) => handleStudentNumber(Number(e.target.value))}
            />
            <span
              className={`ml-2 text-lg font-medium ${studentName ? '' : 'text-red-500'}`}
            >
              {studentName
                ? `이름: ${studentName}`
                : '번호를 바르게 입력해주세요'}
            </span>
            <Button
              variant="primary-outline"
              type="button"
              className="ml-2"
              disabled={!studentName || isStudentFixed}
              onClick={fixStudent}
            >
              확인
            </Button>
          </div>
          {renderAnswerSheet()}
          <div className="mt-8">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!isStudentFixed}
            >
              {isStudentFixed ? '답안 제출' : '출석번호 미입력'}
            </Button>
          </div>
        </form>
      ) : (
        <p>시험 데이터를 불러오는 중입니다...</p>
      )}
    </div>
  );
}

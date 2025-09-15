import { Button } from '@/components/button';
import { Label } from '@radix-ui/react-label';
import React, { useState } from 'react';
import TeamResult from '../team-result/team-result';

type Mode = 'names' | 'numbers';

export default function TeamSetup() {
  const [mode, setMode] = useState<Mode>('numbers');
  const [studentCountInput, setStudentCountInput] = useState<number | ''>('');
  const [nameTextarea, setNameTextarea] = useState('');
  const [students, setStudents] = useState<string[]>([]);
  const [groupCountInput, setGroupCountInput] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [proceedPayload, setProceedPayload] = useState<{
    students: string[];
    groupCount: number;
  } | null>(null);

  const parseNames = (text: string) =>
    text
      .split(/[,\n;]+/)
      .map((s) => s.trim())
      .filter(Boolean);

  const generateFromCount = () => {
    if (!studentCountInput || Number(studentCountInput) < 1) {
      setError('학생 수를 1 이상 입력하세요.');
      return;
    }
    const n = Number(studentCountInput);
    const arr = Array.from({ length: n }, (_, i) => String(i + 1));
    setStudents(arr);
    setError(null);
  };

  const generateFromNames = () => {
    const arr = parseNames(nameTextarea);
    if (arr.length === 0) {
      setError('이름을 한 명 이상 입력하세요.');
      return;
    }
    setStudents(arr);
    setError(null);
  };

  const validForProceed = () => {
    const groupCount = Number(groupCountInput);
    return (
      students.length >= 1 && groupCount >= 1 && Number.isInteger(groupCount)
    );
  };

  const proceed = () => {
    if (!validForProceed()) {
      setError('학생 목록과 모둠 수를 확인하세요.');
      return;
    }
    setError(null);
    setProceedPayload({
      students,
      groupCount: Number(groupCountInput),
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-2">
        1단계 — 입력 (학생 목록 생성)
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        이 단계에서 학생 목록(이름 또는 출석번호)과 모둠 수를 설정합니다.
      </p>

      <div className="flex gap-2 mb-4">
        <Button
          className={`px-4 py-2 rounded ${
            mode === 'numbers' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
          onClick={() => setMode('numbers')}
        >
          숫자(출석번호) 모드
        </Button>
        <Button
          className={`px-4 py-2 rounded ${
            mode === 'names' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
          onClick={() => setMode('names')}
        >
          이름 모드
        </Button>
      </div>

      {mode === 'numbers' ? (
        <div className="mb-4">
          <Label className="block text-sm font-medium mb-1">학생 수</Label>
          <input
            type="number"
            min={1}
            value={studentCountInput === '' ? '' : studentCountInput}
            onChange={(e) =>
              setStudentCountInput(
                e.target.value === '' ? '' : Number(e.target.value),
              )
            }
            className="border rounded px-3 py-2 w-40"
            placeholder="예: 20"
          />
          <div className="mt-2">
            <Button
              onClick={generateFromCount}
              className="px-3 py-1 rounded bg-green-600 text-white"
            >
              출석번호 생성
            </Button>
            <span className="text-sm text-gray-500 ml-2">
              1 ~ n 까지의 번호를 생성합니다.
            </span>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <Label className="block text-sm font-medium mb-1">
            학생 이름 (줄바꿈 또는 콤마로 구분)
          </Label>
          <textarea
            rows={6}
            value={nameTextarea}
            onChange={(e) => setNameTextarea(e.target.value)}
            className="w-full border rounded p-2"
            placeholder={'예: \n김철수\n이영희\n박민수,최지우'}
          />
          <div className="mt-2">
            <Button
              onClick={generateFromNames}
              className="px-3 py-1 rounded bg-green-600 text-white"
            >
              이름 목록 생성
            </Button>
            <span className="text-sm text-gray-500 ml-2">
              한 줄에 하나씩 또는 콤마로 여러 이름 입력 가능.
            </span>
          </div>
        </div>
      )}

      <div className="mb-4">
        <Label className="block text-sm font-medium mb-1">모둠 수</Label>
        <input
          type="number"
          min={1}
          value={groupCountInput === '' ? '' : groupCountInput}
          onChange={(e) =>
            setGroupCountInput(
              e.target.value === '' ? '' : Number(e.target.value),
            )
          }
          className="border rounded px-3 py-2 w-40"
          placeholder="예: 4"
        />
      </div>

      <div className="mb-4">
        <Button
          onClick={proceed}
          className={`px-4 py-2 rounded bg-blue-700 text-white ${
            !validForProceed() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!validForProceed()}
        >
          모둠 랜덤 배정하기
        </Button>
      </div>

      {error && <div className="text-red-600 mb-3">{error}</div>}

      {proceedPayload && (
        <TeamResult
          students={proceedPayload.students}
          groupCount={proceedPayload.groupCount}
        />
      )}
    </div>
  );
}

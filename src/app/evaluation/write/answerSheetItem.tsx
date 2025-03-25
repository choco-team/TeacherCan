'use client';

// components/AnswerSheetItem.jsx
import React from 'react';
import useAnswerSheetStore from '@/store/use-answer-sheet-store';

interface Props {
  id: string;
  index: number;
}

// 개별 답안지 항목 컴포넌트
export function AnswerSheetItem({ index, id }: Props) {
  const { answerSheet, correctAnswer, updateAnswerSheet, setCorrectAnswer } =
    useAnswerSheetStore();
  const item = answerSheet[index];

  if (!item) return null;

  // 문제 유형 변경 핸들러
  const handleTypeChange = (e) => {
    const newFormat = e.target.value;

    if (newFormat === 'select') {
      updateAnswerSheet(id, { format: 'select', counts: 4 });
      setCorrectAnswer(id, 1); // 기본값으로 첫 번째 선택지 설정
    } else if (newFormat === 'input') {
      updateAnswerSheet(id, { format: 'input' });
      setCorrectAnswer(id, ''); // 빈 문자열로 초기화
    } else if (newFormat === 'textarea') {
      updateAnswerSheet(id, { format: 'textarea' });
      setCorrectAnswer(id, ''); // 빈 문자열로 초기화
    }
  };

  // 선택지 개수 변경 핸들러
  const handleOptionCountChange = (e) => {
    const count = Math.max(2, Math.min(10, parseInt(e.target.value, 10) || 2));
    updateAnswerSheet(id, { counts: count });

    // 만약 현재 정답이 선택지 범위를 벗어나면 조정
    const currentAnswer = correctAnswer[item.id];
    if (typeof currentAnswer === 'number' && currentAnswer > count) {
      setCorrectAnswer(id, count);
    }
  };

  // 정답 변경 핸들러
  const handleCorrectAnswerChange = (value) => {
    setCorrectAnswer(id, value);
  };

  return (
    <div className="p-5 border rounded-lg mb-4 bg-white">
      <div className="mb-4">
        <label
          htmlFor={item.id}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {index + 1}번 문제 유형
        </label>
        <select
          id={item.id}
          value={item.format}
          onChange={handleTypeChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="select">선택지형</option>
          <option value="input">단답형</option>
          <option value="textarea">서술형</option>
        </select>
      </div>

      {item.format === 'select' && (
        <div className="space-y-4">
          <div>
            <label
              htmlFor={item.id}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              선택지 갯수
            </label>
            <input
              id={item.id}
              type="number"
              min="2"
              max="10"
              value={item.counts}
              onChange={handleOptionCountChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor={`${item.id}answer`}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              정답 선택
            </label>
            <select
              id={`${item.id}answer`}
              value={correctAnswer[index] || ''}
              onChange={(e) =>
                handleCorrectAnswerChange(Number(e.target.value))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="" disabled>
                정답을 선택해주세요
              </option>
              {[...Array(item.counts)].map((key, i) => (
                <option key={key} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {item.format === 'input' && (
        <div>
          <label
            htmlFor={item.id}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            정답
          </label>
          <input
            id={item.id}
            type="text"
            value={correctAnswer[index] || ''}
            onChange={(e) => handleCorrectAnswerChange(e.target.value)}
            placeholder="정답을 입력해주세요(선택)"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {item.format === 'textarea' && (
        <div>
          <label
            htmlFor={`${item.id}answer`}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            모범 답안
          </label>
          <textarea
            id={`${item.id}answer`}
            value={correctAnswer[index] || ''}
            onChange={(e) => handleCorrectAnswerChange(e.target.value)}
            placeholder="모범 답안을 입력해주세요(선택)"
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>
      )}
    </div>
  );
}

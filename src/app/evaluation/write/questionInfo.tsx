'use client';

import { fetchWithAuth } from '@/utils/api/fetchWithAuth';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/button';
import * as mammoth from 'mammoth';
import useAnswerSheetStore from '@/store/use-answer-sheet-store';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import AnswerSheet from './answerSheet';

export default function QuestionInfo() {
  const {
    content,
    selectedSubject,
    title,
    comment,
    answerSheet,
    correctAnswer,
    questionId,
    setSelectedSubject,
    setComment,
    setContent,
    setTitle,
    setAnswerSheet,
  } = useAnswerSheetStore();
  const [submitResult, setSubmitResult] = useState({
    success: false,
    message: '',
  });
  const router = useRouter();
  const [subjectList, setSubjectList] = useState([]);
  const [fileName, setFileName] = useState('파일을 선택해주세요');
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const fetchSubjectList = async () => {
    try {
      const response = await fetchWithAuth('/subject');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      // ✅ uuid 추가
      const subjectsWithId = data.map((name) => ({
        name,
        uuid: uuidv4(),
      }));

      setSubjectList(subjectsWithId);
    } catch (error) {
      alert(`오류: ${error.message}`);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    try {
      // docx 파일에서 텍스트 추출
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });

      // textarea에 텍스트 삽입
      setContent(result.value);
    } catch (error) {
      console.error('파일 처리 중 오류 발생:', error);
      alert(`파일 처리 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  const submitQuestionData = async () => {
    const fetchData = {
      id: questionId,
      subjectName: selectedSubject,
      title,
      content,
      comment,
      answerSheet,
      correctAnswer,
    };
    try {
      const response = await fetchWithAuth('/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fetchData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      } else {
        setAnswerSheet([], []);
      }
    } catch (error) {
      setSubmitResult({ success: false, message: `오류 :${error.message}` });
    } finally {
      router.replace('/evaluation/prepare');
    }
  };

  useEffect(() => {
    fetchSubjectList();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">평가지 작성하기</h1>

      <form className="space-y-6">
        {/* 과목 선택 */}
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            과목 선택
          </label>
          <select
            id="subject"
            className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedSubject}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              과목을 선택해주세요
            </option>
            {subjectList.map((subject) => (
              <option key={subject.uuid} value={subject.name}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {/* 제목 */}
        <div>
          <label
            htmlFor="QuestionTitle"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            제목
          </label>
          <input
            value={title}
            onChange={handleTitleChange}
            type="text"
            id="QuestionTitle"
            className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="질문 제목을 입력해주세요"
            required
          />
        </div>

        {/* 파일 업로드 - docx 파일로 제한 */}
        <div>
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            파일 첨부 (DOCX 파일만 허용)
          </label>
          <div className="flex items-center">
            <input
              type="file"
              id="file"
              ref={fileInputRef}
              className="hidden"
              accept=".docx"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file"
              className="inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none cursor-pointer"
            >
              파일 선택
            </label>
            <span className="ml-3 text-sm text-gray-500 truncate max-w-xs">
              {fileName}
            </span>
          </div>
        </div>

        {/* 내용 작성 - 파일 내용 자동 삽입 */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            문항 내용
          </label>
          <textarea
            id="content"
            className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px]"
            placeholder="질문 내용을 자세히 작성해주세요 (DOCX 파일을 업로드하면 내용이 자동으로 추출됩니다)"
            value={content}
            onChange={handleContentChange}
            required
          />
        </div>

        {/* 보조 내용 */}
        <div>
          <label
            htmlFor="additionalContent"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            평가 규칙 등 참고사항
          </label>
          <textarea
            id="additionalContent"
            className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
            placeholder="추가적인 정보나 참고사항을 작성해주세요 (선택사항)"
            value={comment}
            onChange={handleCommentChange}
          />
        </div>

        <div>
          <AnswerSheet />
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end">
          <Button type="button" onClick={submitQuestionData}>
            평가지 등록하기
          </Button>
        </div>
        {submitResult.message && (
          <div
            className={`mt-4 p-2 rounded ${submitResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          >
            {submitResult.message}
          </div>
        )}
      </form>
    </div>
  );
}

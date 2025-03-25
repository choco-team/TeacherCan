'use client';

import { Button } from '@/components/button';
import { fetchWithAuth } from '@/utils/api/fetchWithAuth';
import useAnswerSheetStore from '@/store/use-answer-sheet-store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function SubjectQuestion({ subject, initialPage = 1 }) {
  const {
    setSelectedSubject,
    setTitle,
    setComment,
    setContent,
    setAnswerSheet,
    setQuestionId,
  } = useAnswerSheetStore();
  const router = useRouter();
  const [page, setPage] = useState(initialPage);
  const [questions, setQuestions] = useState([]);
  const [getResult, setGetResult] = useState({ success: false, message: '' });

  const getQuestionList = async () => {
    const endPoint = `/question/list/${page + (subject === null ? '' : `/${subject}`)}`;
    setGetResult({ success: false, message: '' });
    try {
      const response = await fetchWithAuth(endPoint);
      const data = await response.json();
      if (!response.ok) {
        setGetResult({ success: false, message: data.message });
        return;
      }
      setQuestions(data);
    } catch (error) {
      setGetResult({ success: false, message: error.message });
    }
  };

  useEffect(() => {
    getQuestionList();
  }, [page, subject]);

  // 페이지 네비게이션 함수
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  async function getExamJwt(id) {
    try {
      const response = await fetchWithAuth(`/question/qrcode?id=${id}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      } else {
        return data.url;
      }
    } catch (error) {
      setGetResult({ success: false, message: error.message });
      return undefined;
    }
  }

  // 버튼 핸들러 함수
  const handleTakeTest = async (id) => {
    const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL;
    const examUrl = await getExamJwt(id);
    // 새 창 열기
    window.open(
      `${baseUrl}/evaluation/exam?url=${examUrl}`,
      '_blank',
      'width=500,height=600,noopener,noreferrer',
    );
  };

  const handleEdit = async (id) => {
    try {
      const response = await fetchWithAuth(`/question/edit/${id}`);
      const data = await response.json();

      if (!response.ok) {
        setGetResult({ success: false, message: data.message });
      } else {
        // 👇 answerSheet에 UUID 추가
        const answerSheetWithIds = data.answerSheet.map((item) => ({
          ...item,
          id: uuidv4(),
        }));

        // ✅ 상태 설정
        setQuestionId(data.id || undefined);
        setSelectedSubject(data.subjectName);
        setComment(data.comment);
        setContent(data.content);
        setTitle(data.title);
        setAnswerSheet(answerSheetWithIds, data.correctAnswer); // ✅ id 포함된 배열로 설정
        router.replace('/evaluation/write');
      }
    } catch (error) {
      setGetResult({ success: false, message: error.message });
    }
  };

  const handleDelete = async (id) => {
    // 삭제 로직 구현
    if (window.confirm('정말로 이 평가지를 삭제하시겠습니까?')) {
      try {
        const response = await fetchWithAuth(`/question/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        if (!response.ok) {
          const data = await response.json();
          setGetResult({ success: false, message: data.message });
          return;
        }
        // 삭제 후 목록 다시 불러오기
        getQuestionList();
        setGetResult({
          success: true,
          message: '평가지가 성공적으로 삭제되었습니다.',
        });
      } catch (error) {
        setGetResult({ success: false, message: error.message });
      }
    }
  };

  // 문항 작성 페이지로 이동하는 함수
  const handleCreate = () => {
    setSelectedSubject('');
    setAnswerSheet([], []);
    setComment('');
    setTitle(null);
    setContent(null);
    router.replace('/evaluation/write');
  };

  // 날짜 형식 변환 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{subject} 평가지 목록</h2>
        <Button onClick={handleCreate}>평가지 작성</Button>
      </div>

      {getResult.message && (
        <div
          className={`mt-4 p-2 rounded ${getResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
          {getResult.message}
        </div>
      )}

      {questions.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 border-b text-left">교과</th>
                  <th className="py-2 px-4 border-b text-left">제목</th>
                  <th className="py-2 px-4 border-b text-left">작성일</th>
                  <th className="py-2 px-4 border-b text-center">작업</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question, index) => (
                  <tr
                    key={question.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="py-2 px-4 border-b">
                      {subject || question.subject_name}
                    </td>
                    <td className="py-2 px-4 border-b font-medium">
                      {question.question_title}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {formatDate(question.question_createdAt)}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="secondary-outline"
                          className="flex items-center gap-x-1.5"
                          onClick={() => handleTakeTest(question.question_id)}
                        >
                          시험
                        </Button>
                        <Button
                          variant="gray-outline"
                          className="flex items-center gap-x-1.5"
                          onClick={() => handleEdit(question.question_id)}
                        >
                          수정
                        </Button>
                        <Button
                          variant="primary-outline"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(question.question_id)}
                        >
                          삭제
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-600">
                총 {questions.length}개 평가지
              </span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="gray-outline"
                onClick={handlePrevPage}
                disabled={page <= 1}
                className="flex items-center gap-x-1.5"
              >
                이전
              </Button>
              <span className="px-4 py-2 bg-gray-100 rounded">
                페이지 {page}
              </span>
              <Button
                variant="gray-outline"
                onClick={handleNextPage}
                disabled={questions.length !== 20}
                className="flex items-center gap-x-1.5"
              >
                다음
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">평가지가가 없습니다.</p>
        </div>
      )}
    </div>
  );
}

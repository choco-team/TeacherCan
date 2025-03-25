'use client';

import { Button } from '@/components/button';
import { fetchWithAuth } from '@/utils/api/fetchWithAuth';
import { useEffect, useState } from 'react';
import SubjectQuestion from './subject-question';

export default function SubjectManager() {
  // 기본 데이터 상태
  const [subjects, setSubjects] = useState([]); // 모든 교과목 목록
  const [selectedSubject, setSelectedSubject] = useState(null); // 선택된 교과목 (세부 정보용)
  const [submitResult, setSubmitResult] = useState({
    success: false,
    message: '',
  }); // API 응답 결과

  // 편집 관련 상태
  const [editingSubject, setEditingSubject] = useState(null); // 현재 편집 중인 교과목
  const [newSubjectName, setNewSubjectName] = useState(null); // 수정 중인 새 이름
  const [isEditing, setIsEditing] = useState(false); // 전체 편집 상태 추적

  // 교과목 목록 불러오기
  const loadSubjects = async () => {
    try {
      const response = await fetchWithAuth('/subject');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }
      setSubjects(data);
      return data;
    } catch (error) {
      setSubmitResult({ success: false, message: `오류: ${error.message}` });
      return [];
    }
  };

  // API로 교과목 저장 (추가/수정)
  const saveSubject = async (method, selectedName, newName) => {
    try {
      const payload =
        method === 'POST'
          ? { name: newName }
          : { selected: selectedName, name: newName };

      const response = await fetchWithAuth('/subject', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setSubmitResult({ success: true, message: '변경 사항을 적용하였습니다' });
      return data;
    } catch (error) {
      setSubmitResult({
        success: false,
        message: `오류 발생: ${error.message}`,
      });
      throw error;
    }
  };

  // 교과목 추가 함수
  const addNewSubject = async () => {
    // 이미 편집 중이면 추가 불가
    if (isEditing) return;

    // 기본 이름으로 새 교과목 추가
    const defaultName = '새 교과';

    // "새 교과목"이라는 이름이 이미 있는지 확인
    const existingNewSubject = subjects.find(
      (subject) => subject === defaultName,
    );

    if (existingNewSubject) {
      // 이미 "새 교과목"이 있으면 해당 교과목을 편집 모드로 설정
      setIsEditing(true);
      setEditingSubject(defaultName);
      setNewSubjectName(defaultName);

      // 성공 메시지 표시
      setSubmitResult({
        success: true,
        message: "'새 교과가 이미 존재합니다. 이름을 변경해주세요.",
      });

      return;
    }

    // 편집 상태 시작
    setIsEditing(true);

    // 로컬 UI 즉시 업데이트 (낙관적 UI 업데이트)
    const updatedSubjects = [...subjects, defaultName];
    setSubjects(updatedSubjects);

    // 새 과목을 편집 모드로 설정
    setEditingSubject(defaultName);
    setNewSubjectName(defaultName);

    // API 호출
    try {
      await saveSubject('POST', null, defaultName);

      // 서버에서 최신 목록 가져오기
      await loadSubjects();
    } catch (error) {
      // 오류 발생 시 로컬 추가 취소
      setSubjects(subjects);
      setEditingSubject(null);
      setNewSubjectName(null);
      setIsEditing(false);
    }
  };

  // 교과목 삭제 함수
  const removeSubject = async (subjectToRemove) => {
    // 로컬 UI 즉시 업데이트 (낙관적 UI 업데이트)
    setSubjects(subjects.filter((subject) => subject !== subjectToRemove));

    // 편집 중이었다면 편집 취소 및 편집 상태 종료
    if (editingSubject === subjectToRemove) {
      setEditingSubject(null);
      setNewSubjectName(null);
      setIsEditing(false);
    }

    // 선택되어 있었다면 선택 취소
    if (selectedSubject === subjectToRemove) {
      setSelectedSubject(null);
    }

    // 여기에 실제 삭제 API 호출 로직 추가 (필요시)
    try {
      const response = await fetchWithAuth('/subject', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: subjectToRemove }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setSubmitResult({ success: true, message: '교과가 삭제되었습니다.' });
      await loadSubjects(); // 목록 새로고침
    } catch (error) {
      setSubmitResult({
        success: false,
        message: `삭제 오류: ${error.message}`,
      });
      await loadSubjects(); // 오류 발생 시 목록 다시 로드하여 복원
    }
  };

  // 교과목 이름 변경 입력 처리
  const handleNameInputChange = (e) => {
    setNewSubjectName(e.target.value);
  };

  // 편집 모드 시작
  const startEditing = (subject) => {
    // 이미 다른 항목 편집 중이면 무시
    if (isEditing && editingSubject !== subject) return;

    setIsEditing(true);
    setEditingSubject(subject);
    setNewSubjectName(subject);
  };

  // 편집 모드 취소
  const cancelEditing = () => {
    setEditingSubject(null);
    setNewSubjectName(null);
    setIsEditing(false);
  };

  // 교과목 선택 (상세 정보 보기)
  const toggleSubjectSelection = (subject) => {
    // 편집 중일 때는 선택 변경 방지
    if (isEditing) return;

    setSelectedSubject(subject === selectedSubject ? null : subject);
  };

  // 편집 완료 처리
  const completeEditing = async () => {
    if (editingSubject && newSubjectName) {
      // 빈 이름은 허용하지 않음
      if (newSubjectName.trim() === '') {
        setSubmitResult({ success: false, message: '교과명을 입력해주세요.' });
        return;
      }

      // 이름이 변경되지 않았으면 편집 모드만 종료
      if (editingSubject === newSubjectName) {
        cancelEditing();
        return;
      }

      try {
        await saveSubject('PATCH', editingSubject, newSubjectName);
        await loadSubjects(); // 목록 새로고침
        cancelEditing(); // 편집 모드 종료
      } catch (error) {
        // 오류 처리는 saveSubject 내에서 이미 처리됨
      }
    } else {
      // 유효하지 않은 입력이면 편집 모드만 종료
      cancelEditing();
    }
  };

  // 선택된 교과목 정보 표시
  const renderSelectedSubjectDetails = () => {
    return <SubjectQuestion subject={selectedSubject} initialPage={1} />;
  };

  // 이미 '새 교과목'이 존재하는지 확인
  const newSubjectExists = subjects.includes('새 교과');

  // 초기 데이터 로드
  useEffect(() => {
    loadSubjects();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">교과 관리</h1>

      <div className="mb-4">
        <Button
          variant="gray-outline"
          className="flex items-center gap-x-1.5"
          onClick={addNewSubject}
          disabled={isEditing} // 편집 중일 때 버튼 비활성화
        >
          {newSubjectExists ? '새 교과 수정하기' : '교과 추가'}
        </Button>
      </div>

      {subjects.length === 0 ? (
        <div className="text-gray-500 my-4">등록된 교과가 없습니다.</div>
      ) : (
        <>
          {/* 교과목 그리드 레이아웃 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
            {subjects.map((subject) => (
              <div
                key={subject}
                className={`border rounded-lg p-3 shadow-sm transition-colors 
                  ${selectedSubject === subject ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}
                  ${isEditing && editingSubject !== subject ? 'opacity-50' : ''}
                  ${subject === '새 교과' ? 'border-blue-400 bg-blue-50' : ''}`}
              >
                <div
                  onClick={() => toggleSubjectSelection(subject)}
                  className="cursor-pointer mb-2"
                >
                  {editingSubject === subject ? (
                    <input
                      type="text"
                      value={newSubjectName}
                      onChange={handleNameInputChange}
                      className="w-full p-1 border rounded"
                      placeholder="교과명 입력"
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === 'Enter') {
                          completeEditing();
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onBlur={(e) => {
                        e.stopPropagation();
                        completeEditing();
                      }}
                    />
                  ) : (
                    <div className="text-center py-1">
                      {subject || (
                        <span className="text-gray-400">교과명이 없음</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-center space-x-2 mt-2 text-sm border-t pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (editingSubject === subject) {
                        completeEditing();
                      } else {
                        startEditing(subject);
                      }
                    }}
                    className="text-blue-500 hover:text-blue-700"
                    disabled={isEditing && editingSubject !== subject} // 다른 항목 편집 중일 때 비활성화
                  >
                    {editingSubject === subject ? '완료' : '수정'}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSubject(subject);
                    }}
                    className="text-red-500 hover:text-red-700"
                    disabled={isEditing && editingSubject !== subject} // 다른 항목 편집 중일 때 비활성화
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>

          {renderSelectedSubjectDetails()}
        </>
      )}

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

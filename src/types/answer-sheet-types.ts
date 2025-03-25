// 문제 유형 문자열 리터럴 타입
export type QuestionFormat = 'select' | 'input' | 'textarea';

// 선택지형 문제 타입
export interface SelectQuestionSheet {
  id: string;
  format: 'select';
  counts: number;
}

// 단답형 문제 타입
export interface InputQuestionSheet {
  id: string;
  format: 'input';
}

// 서술형 문제 타입
export interface TextareaQuestionSheet {
  id: string;
  format: 'textarea';
}

// 답안지 항목 타입 (유니온 타입)
export type AnswerSheetItem =
  | SelectQuestionSheet
  | InputQuestionSheet
  | TextareaQuestionSheet;

// 정답 타입 (선택지형은 숫자, 단답형과 서술형은 문자열)
export type CorrectAnswerItem = number | string;

// 전체 답안지 타입
export interface AnswerSheet {
  answerSheet: AnswerSheetItem[];
  correctAnswer: CorrectAnswerItem[];
  content: string | null;
  comment: string;
  title: string | null;
  selectedSubject: string;
  questionId: number | undefined;
}

// 업데이트를 위한 타입 (타입 안전성 보장)
export type SelectUpdate = { format?: 'select'; counts?: number };
export type InputUpdate = { format?: 'input' };
export type TextareaUpdate = { format?: 'textarea' };
export type AnswerSheetItemUpdate = SelectUpdate | InputUpdate | TextareaUpdate;

// Zustand 스토어 타입
export interface AnswerSheetStore extends AnswerSheet {
  // 액션들
  addAnswerSheet: (format: QuestionFormat, counts?: number) => void;
  updateAnswerSheet: (id: string, updatedSheet: AnswerSheetItemUpdate) => void;
  removeAnswerSheet: (id: string) => void;
  setCorrectAnswer: (id: string, answer: CorrectAnswerItem) => void;
  setAnswerSheet: (
    answerSheet: AnswerSheetItem[],
    correctAnswer: CorrectAnswerItem[],
  ) => void;
  setComment: (index: string) => void;
  setContent: (index: string) => void;
  setTitle: (index: string) => void;
  setSelectedSubject: (index: string) => void;
  setQuestionId: (index: number | undefined) => void;
}

// Zustand 전역 상태 관리
export interface AuthState {
  isAuthenticated: boolean;
  user: number | null;
  csrfToken: string | null;
  setUser: (userId: number) => void;
  setCsrf: (csrfToken: string) => void;
}

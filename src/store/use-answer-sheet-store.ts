import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import {
  AnswerSheetStore,
  AnswerSheetItem,
  CorrectAnswerItem,
  QuestionFormat,
  AnswerSheetItemUpdate,
} from '../types/answer-sheet-types';

// 답안지 상태 관리를 위한 zustand store
const useAnswerSheetStore = create<AnswerSheetStore>((set) => ({
  // 답안지 형식 배열
  answerSheet: [],
  // 정답 배열
  correctAnswer: [],
  content: null,
  comment: '',
  title: null,
  selectedSubject: '',
  questionId: null,

  // 답안지 형식 추가
  addAnswerSheet: (format: QuestionFormat, counts?: number) =>
    set((state) => {
      const id = uuidv4();
      let newItem: AnswerSheetItem;

      if (format === 'select') {
        newItem = { id, format: 'select', counts: counts || 4 };
      } else if (format === 'input') {
        newItem = { id, format: 'input' };
      } else {
        newItem = { id, format: 'textarea' };
      }

      const newAnswer: CorrectAnswerItem = format === 'select' ? 1 : '';

      return {
        answerSheet: [...state.answerSheet, newItem],
        correctAnswer: [...state.correctAnswer, newAnswer],
      };
    }),

  // store/useAnswerSheetStore.ts - 수정된 updateAnswerSheet 함수
  updateAnswerSheet: (id: string, updatedSheet: AnswerSheetItemUpdate) =>
    set((state) => {
      const index = state.answerSheet.findIndex((item) => item.id === id);
      if (index === -1) return {};

      const updatedItems = [...state.answerSheet];
      const currentItem = updatedItems[index];

      if (updatedSheet.format) {
        if (updatedSheet.format === 'select') {
          updatedItems[index] = {
            id: currentItem.id,
            format: 'select',
            counts:
              'counts' in updatedSheet && updatedSheet.counts !== undefined
                ? updatedSheet.counts
                : 4,
          };
        } else if (updatedSheet.format === 'input') {
          updatedItems[index] = { id: currentItem.id, format: 'input' };
        } else {
          updatedItems[index] = { id: currentItem.id, format: 'textarea' };
        }
      } else if (currentItem.format === 'select' && 'counts' in updatedSheet) {
        updatedItems[index] = {
          id: currentItem.id,
          format: 'select',
          counts:
            updatedSheet.counts !== undefined
              ? updatedSheet.counts
              : currentItem.counts,
        };
      }

      return { answerSheet: updatedItems };
    }),

  // 답안지 형식 삭제
  removeAnswerSheet: (id: string) =>
    set((state) => {
      const index = state.answerSheet.findIndex((item) => item.id === id);
      if (index === -1) return {};

      return {
        answerSheet: state.answerSheet.filter((item) => item.id !== id),
        correctAnswer: state.correctAnswer.filter((_, i) => i !== index),
      };
    }),

  // 정답 설정
  setCorrectAnswer: (id: string, answer: CorrectAnswerItem) =>
    set((state) => {
      const index = state.answerSheet.findIndex((item) => item.id === id);
      if (index === -1) return {};

      return {
        correctAnswer: state.correctAnswer.map((ans, i) =>
          i === index ? answer : ans,
        ),
      };
    }),

  // 전체 답안지 및 정답 설정 (초기화 또는 불러오기 용도)
  setAnswerSheet: (
    answerSheet: AnswerSheetItem[],
    correctAnswer: CorrectAnswerItem[],
  ) =>
    set(() => ({
      answerSheet,
      correctAnswer,
    })),

  // content 값 설정
  setContent: (content: string | null) =>
    set(() => ({
      content,
    })),

  // comment 값 설정
  setComment: (comment: string) =>
    set(() => ({
      comment,
    })),

  // title 값 설정
  setTitle: (title: string | null) =>
    set(() => ({
      title,
    })),

  // selectedSubject 값 설정
  setSelectedSubject: (selectedSubject: string) =>
    set(() => ({
      selectedSubject,
    })),
  // selectedSubject 값 설정
  setQuestionId: (questionId: number | undefined) =>
    set(() => ({
      questionId,
    })),
}));
export default useAnswerSheetStore;

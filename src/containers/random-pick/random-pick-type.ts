import { PICK_TYPES } from './random-pick-constants';

export type RandomPickType = {
  id: string;
  createdAt: string;
  title: string;
  pickType: PickType;
  pickList: InnerPickListType[];
  options: OptionsType;
  history?: RandomPickHistoryItem[];
};

export type InnerPickListType = {
  id: string;
  value: string;
  isPicked: boolean;
  isUsed: boolean;
};

export type PickType = (typeof PICK_TYPES)[number]['type'];

export type OptionsType = {
  isExcludingSelected: boolean;
  isHideResult: boolean;
  isMixingAnimation: boolean;
};

export type RandomPickHistoryItem = {
  pickedAt: string;
  winners: { id: string; value: string }[];
};

// 공통 Student 인터페이스
export interface Student {
  id: string;
  name: string;
}

// PickType에 따른 라벨 매핑
export const PICK_TYPE_LABELS: Record<PickType, string> = {
  numbers: '번호',
  names: '이름',
  'student-data': '학생 데이터',
} as const;

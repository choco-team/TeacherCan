import { creatId } from '@/utils/createNanoid';

export const INIT_STUDENT_NAMES = [
  { id: creatId(), value: '학생1', isPicked: false, isUsed: true },
  { id: creatId(), value: '학생2', isPicked: false, isUsed: true },
  { id: creatId(), value: '학생3', isPicked: false, isUsed: true },
];
export const INIT_STUDENT_NUMBERS = [
  { id: creatId(), value: '1', isPicked: false, isUsed: true },
  { id: creatId(), value: '2', isPicked: false, isUsed: true },
  { id: creatId(), value: '3', isPicked: false, isUsed: true },
];

export const PICK_TYPES = [
  {
    type: 'numbers',
    label: '번호',
  },
  {
    type: 'names',
    label: '이름',
  },
] as const;

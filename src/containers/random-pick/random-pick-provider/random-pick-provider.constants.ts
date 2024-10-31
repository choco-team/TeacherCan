export const INIT_STUDENT_NAMES = [
  { value: '학생1', isPicked: false, isUsed: false },
  { value: '학생2', isPicked: false, isUsed: false },
  { value: '학생3', isPicked: false, isUsed: false },
];
export const INIT_STUDENT_NUMBERS = [
  { value: '1', isPicked: false, isUsed: false },
  { value: '2', isPicked: false, isUsed: false },
  { value: '3', isPicked: false, isUsed: false },
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

export const PLACE_SELECTED_STUDENT_TYPES = [
  {
    type: 'none',
    label: '없음',
  },
  {
    type: 'separate',
    label: '분리',
  },
] as const;

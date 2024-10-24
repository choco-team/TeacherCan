export const INIT_STUDENT_NAMES = ['학생1', '학생2', '학생3'];
export const INIT_STUDENT_NUMBERS = ['1', '2', '3'];

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

export const SORT_SELECTED_STUDENT_TYPES = [
  {
    type: 'none',
    label: '없음',
  },
  {
    type: 'front',
    label: '앞으로',
  },
  {
    type: 'back',
    label: '뒤로',
  },
] as const;

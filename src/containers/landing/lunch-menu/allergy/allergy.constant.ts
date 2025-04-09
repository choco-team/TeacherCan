export const ALLERGY_LIST = [
  { id: 1, name: '난류' },
  { id: 2, name: '우유' },
  { id: 3, name: '메밀' },
  { id: 4, name: '땅콩' },
  { id: 5, name: '대두' },
  { id: 6, name: '밀' },
  { id: 7, name: '고등어' },
  { id: 8, name: '게' },
  { id: 9, name: '새우' },
  { id: 10, name: '돼지고기' },
  { id: 11, name: '복숭아' },
  { id: 12, name: '토마토' },
  { id: 13, name: '아황산류' },
  { id: 14, name: '호두' },
  { id: 15, name: '닭고기' },
  { id: 16, name: '쇠고기' },
  { id: 17, name: '오징어' },
  { id: 18, name: '조개류(굴, 전복, 홍합 포함)' },
  { id: 19, name: '잣' },
] as const;

export const ALLERGY_MAP: Map<number, string> = new Map(
  ALLERGY_LIST.map(({ id, name }) => [id, name]),
);

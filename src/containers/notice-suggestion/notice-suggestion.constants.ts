export const NOTICE_SUGGESTION_EXAMPLES = [
  {
    category: '교우 관계',
    sentence: '친구의 이야기를 끝까지 듣기',
  },
  {
    category: '학교폭력예방',
    sentence: '소중한 나만큼 다른 사람들도 소중하게 여기기',
  },
  {
    category: '안전',
    sentence: '교실 문 조심스럽게 여닫기',
  },
  {
    category: '학교 규칙',
    sentence: '도서실에서 빌린 책 기간 안에 반납하기',
  },
  {
    category: '건강',
    sentence: '밖에서 들어왔을 때와 밥 먹기 전에 반드시 손 씻기',
  },
];

export const NOTICE_SUGGESTION_CATEGORIES = [
  { label: '인성', value: '인성' },
  { label: '생활 습관', value: '생활 습관' },
  { label: '학습 습관', value: '학습 습관' },
  { label: '학교폭력예방', value: '학교폭력예방' },
  { label: '안전', value: '안전' },
  { label: '건강', value: '건강' },
  { label: '예절', value: '예절' },
  { label: '효도', value: '효도' },
  { label: '독서', value: '독서' },
  { label: '진로', value: '진로' },
  { label: '환경 보호', value: '환경 보호' },
  { label: '경제·금융', value: '경제·금융' },
  { label: '민주 시민', value: '민주 시민' },
  { label: '직접 입력...', value: 'custom' },
] as const;

export const NOTICE_SUGGESTION_ERROR_CODES = {
  RATE_LIMIT: 'RATE_LIMIT',
  INVALID_FORMAT: 'INVALID_FORMAT',
} as const;

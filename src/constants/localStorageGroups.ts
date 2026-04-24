/**
 * 로컬 스토리지 키를 기능(페이지)별로 그룹화한 상수.
 * useLocalStorage의 LocalStorageKey와 동기화하며, clock-container 등에서 직접 사용하는 키도 포함.
 */

/** 키별 사용자용 표시 이름 및 설명 */
export const LOCAL_STORAGE_KEY_META: Record<
  string,
  { label: string; description: string }
> = {
  'recently-visited': {
    label: '최근 방문한 페이지',
    description: '메인 화면에 표시되는 최근 방문한 메뉴 목록입니다.',
  },
  selectedSchool: {
    label: '선택한 급식 학교',
    description: '급식 메뉴에서 선택한 학교 정보입니다.',
  },
  schedule: {
    label: '일정',
    description: '메인 화면에 저장한 일정 목록입니다.',
  },
  allergies: {
    label: '알레르기 정보',
    description: '급식 메뉴에서 설정한 알레르기 유발 식품 목록입니다.',
  },
  'student-data': {
    label: '학생 명단',
    description:
      '학생 데이터 관리에서 등록한 학생 명단입니다. 랜덤 뽑기·모둠 등에서 사용됩니다.',
  },
  'timer-alarm-sound': {
    label: '타이머 알람 소리',
    description: '타이머 종료 시 재생되는 알람 소리 설정입니다.',
  },
  'teacher-can:clock-memo': {
    label: '시계 메모',
    description: '시계 화면에 표시되는 메모 내용입니다.',
  },
  qrcodes: {
    label: 'QR코드 목록',
    description: 'QR코드 기능에서 저장한 QR코드 목록입니다.',
  },
  'stopwatch-data': {
    label: '그룹 스톱워치 데이터',
    description: '그룹 스톱워치에 저장된 타이머 그룹 정보입니다.',
  },
  'stopwatch-group-grid-columns': {
    label: '그룹 스톱워치 칸 수',
    description: '그룹 스톱워치 화면의 그리드 열 개수 설정입니다.',
  },
  'random-pick-list': {
    label: '랜덤 뽑기 목록',
    description: '랜덤 뽑기에서 사용하는 뽑기 목록입니다.',
  },
  'random-team-settings': {
    label: '랜덤 모둠 설정',
    description: '랜덤 모둠 뽑기의 설정(인원, 방식 등)입니다.',
  },
  'random-team-auto-run': {
    label: '랜덤 모둠 자동 실행',
    description: '랜덤 모둠 화면에서 자동 실행 여부 설정입니다.',
  },
  roomIds: {
    label: '음악 신청 방 목록',
    description: '음악 신청에서 사용하는 방(교실) ID 목록입니다.',
  },
  routines: {
    label: '루틴 목록',
    description: '루틴 타이머에 저장한 루틴 목록입니다.',
  },
};

export const LOCAL_STORAGE_GROUPS = [
  {
    id: 'main',
    label: '메인/공통',
    keys: [
      'recently-visited',
      'selectedSchool',
      'schedule',
      'allergies',
      'student-data',
    ],
  },
  {
    id: 'timer',
    label: '타이머',
    keys: ['timer-alarm-sound'],
  },
  {
    id: 'clock',
    label: '시계',
    keys: ['teacher-can:clock-memo'],
  },
  {
    id: 'qr-code',
    label: 'QR코드',
    keys: ['qrcodes'],
  },
  {
    id: 'stopwatch',
    label: '스톱워치',
    keys: ['stopwatch-data', 'stopwatch-group-grid-columns'],
  },
  {
    id: 'random-pick',
    label: '랜덤뽑기',
    keys: ['random-pick-list'],
  },
  {
    id: 'random-team',
    label: '랜덤 모둠',
    keys: ['random-team-settings'],
  },
  {
    id: 'music-request',
    label: '음악신청',
    keys: ['roomIds'],
  },
  {
    id: 'routine-timer',
    label: '루틴타이머',
    keys: ['routines'],
  },
] as const;

export type LocalStorageGroupId = (typeof LOCAL_STORAGE_GROUPS)[number]['id'];

// 스톱워치 모드 타입
export type StopwatchMode = 'solo' | 'group';

// 랩 기록 타입
export interface LapRecord {
  id: string;
  time: number; // milliseconds
  lapTime: number; // 이전 랩과의 차이
}

// 그룹 타이머 타입
export interface GroupTimer {
  id: string;
  name: string;
  color: string;
  time: number; // milliseconds
  isRunning: boolean;
  isPaused: boolean;
}

// 저장된 그룹 설정
export interface SavedStopwatchGroup {
  id: string;
  title: string;
  createdAt: string;
  timers: Omit<GroupTimer, 'time' | 'isRunning' | 'isPaused'>[];
}

// 그룹 설정 타입
export interface GroupSetup {
  title: string;
  timerCount: number;
  timerNames: string[];
  timerColors: string[];
}

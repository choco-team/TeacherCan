export type ClockType = 'analog' | 'digital';

export interface ClockMemoItem {
  id: string;
  text: string;
  timeTag?: string; // e.g., '14:00 수업 시작'
  pinned: boolean;
  createdAt: number;
}

export interface DigitalClockOptions {
  use24h: boolean;
}

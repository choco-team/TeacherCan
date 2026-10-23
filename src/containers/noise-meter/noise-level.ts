export const DEFAULT_SENSITIVITY = 50;
export const HISTORY_SAMPLE_MS = 100;
export const NOISE_HISTORY_LIMIT = 100;

export type NoiseStage = 'quiet' | 'ok' | 'loud' | 'tooLoud';

export type NoiseSample = {
  id: number;
  value: number;
};

type StageMeta = {
  label: string;
  numberClass: string;
  barClass: string;
  panelClass: string;
  scale: number;
};

// 브라우저 마이크는 보정된 dB SPL을 주지 않는다.
// 화면 숫자는 상대 음량을 0–100으로 펼친 교실 지수다.
const DB_FLOOR = -60;
const DB_CEIL = -12;
const SENSITIVITY_SHIFT_DB = 15;

export const STAGE_META: Record<NoiseStage, StageMeta> = {
  quiet: {
    label: '조용해요',
    numberClass: 'text-emerald-500',
    barClass: 'bg-emerald-400',
    panelClass: 'bg-emerald-50 dark:bg-emerald-950/40',
    scale: 1,
  },
  ok: {
    label: '적당해요',
    numberClass: 'text-sky-500',
    barClass: 'bg-sky-400',
    panelClass: 'bg-sky-50 dark:bg-sky-950/40',
    scale: 1.04,
  },
  loud: {
    label: '시끄러워요',
    numberClass: 'text-orange-500',
    barClass: 'bg-orange-400',
    panelClass: 'bg-orange-50 dark:bg-orange-950/30',
    scale: 1.08,
  },
  tooLoud: {
    label: '너무 시끄러워요',
    numberClass: 'text-red-500',
    barClass: 'bg-red-500',
    panelClass: 'bg-red-50 dark:bg-red-950/40',
    scale: 1.12,
  },
};

export function clampLevel(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

function clampSensitivity(sensitivity: number): number {
  if (!Number.isFinite(sensitivity)) return DEFAULT_SENSITIVITY;
  return Math.min(100, Math.max(0, sensitivity));
}

/**
 * RMS를 교실 지수로 바꾼다.
 * 감도 50이 기본 구간이고, 높을수록 같은 소리가 더 크게 표시된다.
 */
export function rmsToLevel(rms: number, sensitivity: number): number {
  if (!Number.isFinite(rms) || rms <= 0.0001) return 0;

  const db = 20 * Math.log10(rms);
  const offset =
    ((clampSensitivity(sensitivity) - DEFAULT_SENSITIVITY) / 50) *
    SENSITIVITY_SHIFT_DB;
  const floor = DB_FLOOR - offset;
  const ceil = DB_CEIL - offset;
  const normalized = (db - floor) / (ceil - floor);

  return Math.min(100, Math.max(0, normalized * 100));
}

export function smoothLevel(previous: number, next: number): number {
  return previous + (next - previous) * 0.35;
}

export function levelToStage(level: number): NoiseStage {
  const rounded = clampLevel(level);
  if (rounded <= 35) return 'quiet';
  if (rounded <= 55) return 'ok';
  if (rounded <= 75) return 'loud';
  return 'tooLoud';
}

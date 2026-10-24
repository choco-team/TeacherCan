export const HISTORY_SAMPLE_MS = 100;
export const NOISE_HISTORY_LIMIT = 100;
export const GRAPH_MIN_DB = 0;
export const GRAPH_MAX_DB = 140;

export type NoiseStage =
  | 'silent'
  | 'quiet'
  | 'safe'
  | 'limit'
  | 'harmful'
  | 'danger';

export type NoiseSample = {
  id: number;
  value: number;
};

type StageMeta = {
  label: string;
  numberClass: string;
  dotClass: string;
};

type NoiseBand = {
  stage: NoiseStage;
  label: string;
  min: number;
  max: number;
  rangeLabel: string;
};

// 마이크가 주는 값은 풀스케일 대비(dBFS)다.
// A가중치를 적용한 뒤 105를 더해 소음계 dB 눈금에 맞춘다. 사용자가 이 값을 움직이지는 않는다.
const DBFS_OFFSET = 105;

export const STAGE_META: Record<NoiseStage, StageMeta> = {
  silent: {
    label: '침묵',
    numberClass: 'text-sky-500',
    dotClass: 'bg-sky-500',
  },
  quiet: {
    label: '조용함',
    numberClass: 'text-green-600',
    dotClass: 'bg-green-500',
  },
  safe: {
    label: '안전',
    numberClass: 'text-blue-500',
    dotClass: 'bg-blue-500',
  },
  limit: {
    label: '제한',
    numberClass: 'text-orange-500',
    dotClass: 'bg-orange-500',
  },
  harmful: {
    label: '해로움',
    numberClass: 'text-rose-500',
    dotClass: 'bg-rose-500',
  },
  danger: {
    label: '위험',
    numberClass: 'text-red-700',
    dotClass: 'bg-red-700',
  },
};

export const NOISE_BANDS: NoiseBand[] = [
  {
    stage: 'danger',
    label: '위험',
    min: 120,
    max: GRAPH_MAX_DB,
    rangeLabel: '120dB 이상',
  },
  {
    stage: 'harmful',
    label: '해로움',
    min: 100,
    max: 120,
    rangeLabel: '100~119dB',
  },
  {
    stage: 'limit',
    label: '제한',
    min: 85,
    max: 100,
    rangeLabel: '85~99dB',
  },
  {
    stage: 'safe',
    label: '안전',
    min: 70,
    max: 85,
    rangeLabel: '70~84dB',
  },
  {
    stage: 'quiet',
    label: '조용함',
    min: 40,
    max: 70,
    rangeLabel: '40~69dB',
  },
  {
    stage: 'silent',
    label: '침묵',
    min: GRAPH_MIN_DB,
    max: 40,
    rangeLabel: '~39dB',
  },
];

function clampDecibel(decibel: number): number {
  return Math.min(GRAPH_MAX_DB, Math.max(GRAPH_MIN_DB, decibel));
}

/**
 * 마이크 파형의 실제 크기를 dB로 바꾼다.
 * 주파수별로 나누어 더하면 시끄럽지 않은 소리도 높게 나오므로, 파형 전체의 크기를 쓴다.
 */
export function rmsToDecibel(rms: number): number {
  if (!Number.isFinite(rms) || rms <= 0.000001) return GRAPH_MIN_DB;

  return clampDecibel(20 * Math.log10(rms) + DBFS_OFFSET);
}

export function smoothDecibel(previous: number, next: number): number {
  return previous + (next - previous) * 0.45;
}

export function decibelToStage(decibel: number): NoiseStage {
  const rounded = Math.round(decibel);

  if (rounded >= 120) return 'danger';
  if (rounded >= 100) return 'harmful';
  if (rounded >= 85) return 'limit';
  if (rounded >= 70) return 'safe';
  if (rounded >= 40) return 'quiet';
  return 'silent';
}

export function playsWarningSound(stage: NoiseStage): boolean {
  return stage === 'harmful' || stage === 'danger';
}

export function decibelToGraphRatio(decibel: number): number {
  const ratio = (decibel - GRAPH_MIN_DB) / (GRAPH_MAX_DB - GRAPH_MIN_DB);
  return Math.min(1, Math.max(0, ratio));
}

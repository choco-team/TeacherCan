import { cn } from '@/styles/utils';
import {
  GRAPH_MAX_DB,
  GRAPH_MIN_DB,
  NOISE_BANDS,
  NOISE_HISTORY_LIMIT,
  STAGE_META,
  NoiseSample,
  decibelToGraphRatio,
  decibelToStage,
  playsWarningSound,
} from './noise-level';

type NoiseMeterGraphProps = {
  history: NoiseSample[];
  decibel: number;
};

const CHART_WIDTH = 1000;
const CHART_HEIGHT = 420;
const CHART_PAD_X = 16;

const ALERT_COPY = '조용히 해 주세요';

function guideTop(decibel: number) {
  const ratio = (GRAPH_MAX_DB - decibel) / (GRAPH_MAX_DB - GRAPH_MIN_DB);
  return `${ratio * 100}%`;
}

function StageLabel({
  label,
  rangeLabel,
  dotClass,
}: {
  label: string;
  rangeLabel: string;
  dotClass: string;
}) {
  return (
    <span className="flex items-start gap-2 text-[11px] leading-tight text-gray-400">
      <span className={cn('mt-1 size-1.5 shrink-0 rounded-full', dotClass)} />
      <span>
        <span className="block text-gray-500">{label}</span>
        <span className="tabular-nums">{rangeLabel}</span>
      </span>
    </span>
  );
}

function bandLabelTop(min: number, max: number) {
  if (min === max) return '0.75rem';
  return guideTop((min + max) / 2);
}

export default function NoiseMeterGraph({
  history,
  decibel,
}: NoiseMeterGraphProps) {
  const stage = decibelToStage(decibel);
  const meta = STAGE_META[stage];
  const alertCopy = playsWarningSound(stage) ? ALERT_COPY : null;
  const points = history.map((sample, index) => {
    const progress =
      (NOISE_HISTORY_LIMIT - history.length + index + 0.5) /
      NOISE_HISTORY_LIMIT;
    const x = CHART_PAD_X + progress * (CHART_WIDTH - CHART_PAD_X * 2);
    const y = CHART_HEIGHT - decibelToGraphRatio(sample.value) * CHART_HEIGHT;
    return { x, y };
  });
  const latest = points[points.length - 1];
  const line = points.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <div className="w-full">
      <div className="relative h-72 w-full md:h-96">
        <div className="absolute inset-0 md:right-36">
          {NOISE_BANDS.filter(
            (band) => band.min > GRAPH_MIN_DB && band.min < GRAPH_MAX_DB,
          ).map((band) => (
            <div
              key={band.stage}
              className="absolute inset-x-0 border-t border-gray-200 dark:border-gray-800"
              style={{ top: guideTop(band.min) }}
            />
          ))}
          <svg
            className="absolute inset-0 h-full w-full text-gray-900 dark:text-gray-100"
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            preserveAspectRatio="none"
            aria-hidden
          >
            {points.length > 1 ? (
              <polyline
                points={line}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ) : null}
            {latest ? (
              <circle cx={latest.x} cy={latest.y} r="4" fill="currentColor" />
            ) : null}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="bg-bg/80 px-6 py-3 text-center backdrop-blur-sm">
              <p
                className={cn(
                  'text-6xl font-semibold tabular-nums tracking-tight md:text-7xl',
                  meta.numberClass,
                )}
              >
                {Math.round(decibel)}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                dB
                <span className="mx-2 text-gray-300">·</span>
                {meta.label}
              </p>
              {alertCopy ? (
                <p
                  className="mt-2 text-sm font-medium text-red-500"
                  role="alert"
                >
                  {alertCopy}
                </p>
              ) : null}
            </div>
          </div>
        </div>
        <div className="absolute inset-y-0 right-0 hidden w-32 md:block">
          {NOISE_BANDS.map((band) => (
            <div
              key={band.stage}
              className={cn(
                'absolute inset-x-0',
                band.min === band.max ? 'translate-y-0' : '-translate-y-1/2',
              )}
              style={{ top: bandLabelTop(band.min, band.max) }}
            >
              <StageLabel
                label={band.label}
                rangeLabel={band.rangeLabel}
                dotClass={STAGE_META[band.stage].dotClass}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 md:hidden">
        {NOISE_BANDS.map((band) => (
          <StageLabel
            key={band.stage}
            label={band.label}
            rangeLabel={band.rangeLabel}
            dotClass={STAGE_META[band.stage].dotClass}
          />
        ))}
      </div>
    </div>
  );
}

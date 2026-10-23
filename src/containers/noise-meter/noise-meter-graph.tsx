import { cn } from '@/styles/utils';
import {
  NOISE_HISTORY_LIMIT,
  STAGE_META,
  NoiseSample,
  levelToStage,
} from './noise-level';

type NoiseMeterGraphProps = {
  history: NoiseSample[];
};

export default function NoiseMeterGraph({ history }: NoiseMeterGraphProps) {
  return (
    <div className="flex h-36 w-full items-end justify-end md:h-44" aria-hidden>
      {history.map((sample) => {
        const stage = levelToStage(sample.value);
        return (
          <div
            key={sample.id}
            className={cn('rounded-sm', STAGE_META[stage].barClass)}
            style={{
              width: `${100 / NOISE_HISTORY_LIMIT}%`,
              height: `${Math.max(8, sample.value)}%`,
            }}
          />
        );
      })}
    </div>
  );
}

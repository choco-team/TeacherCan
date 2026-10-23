'use client';

import { motion } from 'framer-motion';
import { cn } from '@/styles/utils';
import { STAGE_META, NoiseStage } from './noise-level';

type NoiseMeterDisplayProps = {
  level: number;
  stage: NoiseStage;
};

export default function NoiseMeterDisplay({
  level,
  stage,
}: NoiseMeterDisplayProps) {
  const meta = STAGE_META[stage];
  const isWarning = stage === 'tooLoud';

  return (
    <motion.div
      className={cn(
        'flex w-full flex-col items-center justify-center rounded-3xl px-6 py-10',
        meta.panelClass,
      )}
      animate={isWarning ? { scale: [1, 1.02, 1] } : { scale: meta.scale }}
      transition={
        isWarning
          ? { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 0.3 }
      }
    >
      <p className="text-xl font-medium text-text-subtitle md:text-2xl">
        현재 교실
      </p>
      <motion.p
        className={cn(
          'mt-2 text-8xl font-semibold tabular-nums leading-none md:text-9xl',
          meta.numberClass,
        )}
        animate={{ scale: meta.scale }}
        transition={{ duration: 0.3 }}
      >
        {level}
      </motion.p>
      <p
        className={cn(
          'mt-4 text-3xl font-semibold md:text-5xl',
          meta.numberClass,
        )}
        aria-live="polite"
      >
        {meta.label}
      </p>
    </motion.div>
  );
}

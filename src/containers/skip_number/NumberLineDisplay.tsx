'use client';

import React, { useEffect, useMemo, useRef } from 'react';

import type { Jump } from './types';

interface NumberLineDisplayProps {
  jumps: Jump[];
  allNumbers: number[];
  tickInterval: number;
}

export function NumberLineDisplay({
  jumps,
  allNumbers,
  tickInterval,
}: NumberLineDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { min, max, ticks } = useMemo(() => {
    const nums = allNumbers;
    const lo = Math.min(...nums);
    const hi = Math.max(...nums);

    // 새 프로젝트의 padding 로직을 그대로 가져옵니다.
    const padding = Math.max(Math.abs(hi - lo) * 0.2, tickInterval * 3);
    const calculatedMin = Math.max(
      0,
      Math.floor((lo - padding) / tickInterval) * tickInterval,
    );
    const calculatedMax =
      Math.ceil((hi + padding) / tickInterval) * tickInterval;

    const calculatedTicks: number[] = [];
    for (let i = calculatedMin; i <= calculatedMax; i += tickInterval) {
      calculatedTicks.push(i);
    }

    return { min: calculatedMin, max: calculatedMax, ticks: calculatedTicks };
  }, [allNumbers, tickInterval]);

  const numToPercent = (n: number) => {
    return ((n - min) / (max - min)) * 100;
  };

  useEffect(() => {
    if (containerRef.current && allNumbers.length > 1) {
      const lastNum = allNumbers[allNumbers.length - 1];
      const pct = ((lastNum - min) / (max - min)) * 100;
      const scrollTarget =
        (pct / 100) * containerRef.current.scrollWidth -
        containerRef.current.clientWidth / 2;

      containerRef.current.scrollTo({
        left: Math.max(0, scrollTarget),
        behavior: 'smooth',
      });
    }
  }, [allNumbers, min, max]);

  const topPadding = 120;
  const jumpVars: React.CSSProperties = {
    ['--jump-forward' as any]: '0 64% 68%',
    ['--jump-backward' as any]: '197 100% 32%',
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-card rounded-2xl border-2 border-border shadow-lg overflow-x-auto px-8 pb-16"
      style={{
        minHeight: 180,
        paddingTop: topPadding,
        ...jumpVars,
      }}
    >
      <div
        className="relative"
        style={{ minWidth: Math.max(800, ticks.length * 70) }}
      >
        {jumps.map((jump) => {
          const fromPct = numToPercent(jump.from);
          const toPct = numToPercent(jump.to);
          const leftPct = Math.min(fromPct, toPct);
          const widthPct = Math.abs(toPct - fromPct);
          const isForward = jump.step > 0;
          const arcHeight = 45;

          return (
            <div
              key={jump.index}
              className="absolute"
              style={{
                left: `${leftPct}%`,
                width: `${widthPct}%`,
                bottom: 30,
                height: arcHeight,
                pointerEvents: 'none',
              }}
            >
              <svg
                viewBox={`0 0 100 ${arcHeight}`}
                className="w-full overflow-visible"
                style={{ height: arcHeight }}
                preserveAspectRatio="none"
              >
                <path
                  d={
                    isForward
                      ? `M 0 ${arcHeight} Q 50 ${-arcHeight * 0.3} 100 ${arcHeight}`
                      : `M 100 ${arcHeight} Q 50 ${-arcHeight * 0.3} 0 ${arcHeight}`
                  }
                  fill="none"
                  stroke={
                    isForward
                      ? 'hsl(var(--jump-forward))'
                      : 'hsl(var(--jump-backward))'
                  }
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                  strokeDasharray="8 4"
                />
                <polygon
                  points={
                    isForward
                      ? `94,${arcHeight - 6} 100,${arcHeight} 94,${arcHeight + 6}`
                      : `6,${arcHeight - 6} 0,${arcHeight} 6,${arcHeight + 6}`
                  }
                  fill={
                    isForward
                      ? 'hsl(var(--jump-forward))'
                      : 'hsl(var(--jump-backward))'
                  }
                />
              </svg>
              <span
                className="absolute text-base font-bold px-2 py-0.5 rounded-full"
                style={{
                  left: '50%',
                  top: -4,
                  transform: 'translateX(-50%)',
                  color: isForward
                    ? 'hsl(var(--jump-forward))'
                    : 'hsl(var(--jump-backward))',
                  backgroundColor: isForward
                    ? 'hsl(var(--jump-forward) / 0.1)'
                    : 'hsl(var(--jump-backward) / 0.1)',
                }}
              >
                {isForward ? '+' : ''}
                {jump.step}
              </span>
            </div>
          );
        })}

        {/* Number line axis */}
        <div className="relative h-2 bg-foreground/30 rounded-full">
          {/* Major tick marks */}
          {ticks.map((tick) => {
            const pct = numToPercent(tick);
            const isHighlighted = allNumbers.includes(tick);

            return (
              <div
                key={tick}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${pct}%`,
                  transform: 'translateX(-50%)',
                  top: -10,
                  zIndex: 2,
                }}
              >
                <div
                  className={`rounded-full ${
                    isHighlighted
                      ? 'h-6 w-1.5 bg-primary'
                      : 'h-4 w-0.5 bg-foreground/40'
                  }`}
                />
                <span
                  className={`mt-2 select-none ${
                    isHighlighted
                      ? 'font-bold text-primary text-xl'
                      : 'text-muted-foreground text-base'
                  }`}
                >
                  {tick}
                </span>
              </div>
            );
          })}

          {/* Highlighted dots */}
          {/* start dot */}
          <div
            key="dot-start"
            className="absolute rounded-full border-2 border-card bg-accent w-6 h-6"
            style={{
              left: `${numToPercent(allNumbers[0])}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: jumps.length > 0 ? 5 : 10,
            }}
          />

          {jumps.map((jump) => {
            const pct = numToPercent(jump.to);
            const isLatest = jump.index === jumps.length - 1;
            const dotClass = isLatest
              ? 'bg-primary w-7 h-7 animate-bounce'
              : 'bg-primary/70 w-5 h-5';

            return (
              <div
                key={`dot-${jump.index}`}
                className={`absolute rounded-full border-2 border-card ${dotClass}`}
                style={{
                  left: `${pct}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: isLatest ? 10 : 5,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* eslint-disable react/no-array-index-key */

'use client';

import { memo, useMemo } from 'react';
import { useKstNow } from '@/hooks/use-kst-now';

interface AnalogClockProps {
  size?: number; // px
  accentColor?: string; // tailwind class or hex
}

function getAngles(date: Date) {
  // Tick per second (no smooth ms-based movement)
  const s = date.getSeconds();
  const m = date.getMinutes();
  const h = date.getHours() % 12;

  return {
    // Include second contribution so hour/minute update every second (still discrete)
    hourDeg: h * 30 + m * 0.5 + s * (0.5 / 60),
    minuteDeg: m * 6 + s * 0.1,
    secondDeg: s * 6, // tick
  };
}

export const AnalogClock = memo(function AnalogClock({
  size = 360,
  accentColor = '#111827', // gray-900
}: AnalogClockProps) {
  // Update once per second for ticking hands
  const now = useKstNow(1000);
  const { hourDeg, minuteDeg, secondDeg } = useMemo(
    () => getAngles(now),
    [now],
  );

  const center = size / 2;
  const radius = center - 8;
  const numeralRadius = radius - 30;

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow"
      >
        {/* Face */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="white"
          className="stroke-gray-200"
          strokeWidth={2}
          stroke="currentColor"
        />

        {/* Hour numerals */}
        {[...Array(12)].map((_, i) => {
          const hour = i + 1; // 1..12
          const angle = (hour * Math.PI) / 6; // 30deg steps
          const x = center + numeralRadius * Math.sin(angle);
          const y = center - numeralRadius * Math.cos(angle);
          return (
            <text
              key={hour}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={Math.max(12, size * 0.06)}
              fill="#4B5563" // gray-600
            >
              {hour}
            </text>
          );
        })}

        {/* Hour marks */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * Math.PI) / 6;
          const inner = radius - 16;
          const outer = radius - 4;
          const x1 = center + inner * Math.sin(angle);
          const y1 = center - inner * Math.cos(angle);
          const x2 = center + outer * Math.sin(angle);
          const y2 = center - outer * Math.cos(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#9CA3AF"
              strokeWidth={3}
              strokeLinecap="round"
            />
          );
        })}

        {/* Minute marks */}
        {[...Array(60)].map((_, i) => {
          if (i % 5 === 0) return null;
          const angle = (i * Math.PI) / 30;
          const inner = radius - 10;
          const outer = radius - 4;
          const x1 = center + inner * Math.sin(angle);
          const y1 = center - inner * Math.cos(angle);
          const x2 = center + outer * Math.sin(angle);
          const y2 = center - outer * Math.cos(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#E5E7EB"
              strokeWidth={2}
              strokeLinecap="round"
            />
          );
        })}

        {/* Hour hand */}
        <g transform={`rotate(${hourDeg} ${center} ${center})`}>
          <line
            x1={center}
            y1={center + 10}
            x2={center}
            y2={center - radius + 70}
            stroke={accentColor}
            strokeWidth={6}
            strokeLinecap="round"
          />
        </g>

        {/* Minute hand */}
        <g transform={`rotate(${minuteDeg} ${center} ${center})`}>
          <line
            x1={center}
            y1={center + 14}
            x2={center}
            y2={center - radius + 36}
            stroke={accentColor}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </g>

        {/* Second hand */}
        <g transform={`rotate(${secondDeg} ${center} ${center})`}>
          <line
            x1={center}
            y1={center + 18}
            x2={center}
            y2={center - radius + 20}
            stroke="#EF4444"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </g>

        {/* Center dot */}
        <circle cx={center} cy={center} r={4} fill={accentColor} />
      </svg>
    </div>
  );
});

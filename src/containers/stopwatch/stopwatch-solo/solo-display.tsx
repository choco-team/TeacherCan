'use client';

import { formatTime } from '../stopwatch-utils';

interface SoloDisplayProps {
  time: number;
  className?: string;
}

export default function SoloDisplay({
  time,
  className = '',
}: SoloDisplayProps) {
  return (
    <div className={`text-center ${className}`}>
      <div className="text-6xl md:text-8xl lg:text-[160px] font-mono font-bold text-text-title">
        {formatTime(time)}
      </div>
    </div>
  );
}

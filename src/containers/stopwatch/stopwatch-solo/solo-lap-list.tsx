'use client';

import { ScrollArea } from '@/components/scroll-area';
import { Button } from '@/components/button';
import { Trash2 } from 'lucide-react';
import { formatTime, formatLapTime } from '../stopwatch-utils';
import { LapRecord } from '../stopwatch-type';

interface SoloLapListProps {
  laps: LapRecord[];
  onDeleteLap: (lapId: string) => void;
}

export default function SoloLapList({ laps, onDeleteLap }: SoloLapListProps) {
  if (laps.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-text-description">아직 랩 기록이 없습니다.</p>
      </div>
    );
  }

  return (
    <ScrollArea>
      <div className="space-y-2">
        {laps.toReversed().map((lap, index) => {
          // 원래 순서의 랩 번호 계산 (총 랩 수에서 현재 인덱스를 빼서)
          const originalLapNumber = laps.length - index;

          return (
            <div
              key={lap.id}
              className="flex justify-between items-center px-4 py-2 rounded-lg border bg-bg-primary border-border"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-text-subtitle min-w-[40px]">
                  랩 {originalLapNumber}
                </span>

                <div>
                  <div className="flex items-center gap-1">
                    <div className="text-sm text-text-description min-w-[60px]">
                      경과시간
                    </div>
                    <div className="text-lg font-mono font-bold text-text-title">
                      {formatTime(lap.time)}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <div className="text-sm text-text-description min-w-[60px]">
                      랩 타임
                    </div>
                    <div className="text-lg font-mono font-bold text-text-title">
                      {formatLapTime(lap.lapTime)}
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant="gray-ghost"
                size="sm"
                onClick={() => onDeleteLap(lap.id)}
                className="text-text-description hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

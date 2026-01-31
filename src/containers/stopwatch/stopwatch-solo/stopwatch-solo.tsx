'use client';

import { Button } from '@/components/button';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import SoloStopwatchProvider from './stopwatch-solo-provider';
import {
  useSoloStopwatchState,
  useSoloStopwatchAction,
} from './stopwatch-solo-provider.hooks';
import SoloDisplay from './solo-display';
import SoloLapList from './solo-lap-list';

function StopwatchSoloContent() {
  const { time, isRunning, laps } = useSoloStopwatchState();
  const { start, pause, reset, lap, deleteLap } = useSoloStopwatchAction();

  const handleStartPause = () => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  };

  const handleReset = () => {
    reset();
  };

  const handleLap = () => {
    lap();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 w-full mt-10">
        {/* Left Side - Timer Display and Controls */}
        <div className="flex flex-col items-center space-y-8 lg:h-[calc(100vh-152px)] justify-center">
          <SoloDisplay time={time} />

          {/* Control Buttons */}
          <div className="flex items-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartPause}
              className="size-16 rounded-full"
            >
              {isRunning ? (
                <Pause className="size-8" />
              ) : (
                <Play className="size-8" />
              )}
            </Button>

            {isRunning && (
              <Button
                variant="secondary"
                size="lg"
                onClick={handleLap}
                className="size-16 rounded-full"
              >
                <Flag className="size-8" />
              </Button>
            )}

            <Button
              variant="primary-ghost"
              size="lg"
              onClick={handleReset}
              className="size-16 rounded-full"
            >
              <RotateCcw className="size-8" />
            </Button>
          </div>
        </div>

        {/* Right Side - Lap Records */}
        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-152px)]">
          <h2 className="text-xl font-semibold text-text-title">랩 기록</h2>
          {laps.length > 0 ? (
            <SoloLapList laps={laps} onDeleteLap={deleteLap} />
          ) : (
            <div className="text-center text-text-description py-8">
              아직 랩 기록이 없습니다.
              <br />
              타이머를 시작하고 랩 버튼을 눌러 기록을 추가하세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StopwatchSolo() {
  return (
    <SoloStopwatchProvider>
      <StopwatchSoloContent />
    </SoloStopwatchProvider>
  );
}

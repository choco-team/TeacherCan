'use client';

import { Button } from '@/components/button';
import { Slider } from '@/components/slider';
import useLocalStorage from '@/hooks/useLocalStorage';
import { DEFAULT_SENSITIVITY } from './noise-level';
import NoiseMeterDisplay from './noise-meter-display';
import NoiseMeterGraph from './noise-meter-graph';
import { useNoiseMeter } from './use-noise-meter';

function SensitivityControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="w-full max-w-md space-y-2">
      <div className="flex items-center justify-between text-sm text-text-subtitle">
        <span>감도</span>
        <span className="tabular-nums">{value}</span>
      </div>
      <Slider
        min={0}
        max={100}
        step={1}
        value={[value]}
        onValueChange={([next]) => onChange(next)}
        aria-label="감도"
      />
      <p className="text-xs text-text-subtitle">
        감도를 높이면 같은 소리도 더 크게 표시됩니다.
      </p>
    </div>
  );
}

export default function NoiseMeterContainer() {
  const [storedSensitivity, setStoredSensitivity] = useLocalStorage(
    'noise-meter-sensitivity',
    DEFAULT_SENSITIVITY,
  );
  const sensitivity =
    typeof storedSensitivity === 'number' && Number.isFinite(storedSensitivity)
      ? Math.min(100, Math.max(0, storedSensitivity))
      : DEFAULT_SENSITIVITY;
  const {
    status,
    errorMessage,
    isStarting,
    level,
    history,
    stage,
    start,
    stop,
  } = useNoiseMeter(sensitivity);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 min-h-[calc(100dvh-8rem)]">
      {status === 'measuring' ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-8">
          <NoiseMeterDisplay level={level} stage={stage} />
          <NoiseMeterGraph history={history} />
          <div className="flex w-full flex-col items-center gap-6">
            <SensitivityControl
              value={sensitivity}
              onChange={setStoredSensitivity}
            />
            <Button variant="gray-outline" size="lg" onClick={stop}>
              측정 중지
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold text-text-title md:text-5xl">
              소음 측정기
            </h1>
            <p className="text-base text-text-subtitle md:text-lg">
              교실 소리를 마이크로 읽어 화면에 바로 보여 줍니다. 숫자는 이
              기기의 마이크를 기준으로 한 상대 소음입니다.
            </p>
          </div>
          {errorMessage ? (
            <p className="max-w-md text-sm text-red-500" role="alert">
              {errorMessage}
            </p>
          ) : null}
          <Button size="lg" onClick={start} isPending={isStarting}>
            {errorMessage ? '다시 시도' : '측정 시작'}
          </Button>
          <SensitivityControl
            value={sensitivity}
            onChange={setStoredSensitivity}
          />
        </div>
      )}
    </div>
  );
}

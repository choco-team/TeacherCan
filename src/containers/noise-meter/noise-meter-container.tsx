'use client';

import { Button } from '@/components/button';

export default function NoiseMeterContainer() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8rem)] w-full max-w-5xl flex-col gap-8">
      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold text-text-title md:text-5xl">
            소음 측정기
          </h1>
          <p className="text-base text-text-subtitle md:text-lg">
            교실 소리를 마이크로 읽어 화면에 바로 보여 줍니다. 숫자는 이 기기의
            마이크를 기준으로 한 상대 소음입니다.
          </p>
        </div>
        <Button size="lg">측정 시작</Button>
      </div>
    </div>
  );
}

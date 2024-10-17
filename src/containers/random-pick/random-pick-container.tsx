'use client';

import { Button } from '@/components/button';
import { Sheet, SheetTrigger } from '@/components/sheet';
import { SettingsIcon } from 'lucide-react';
import RandomPickSetting from './random-pick-setting/random-pick-setting';
import RandomPickProvider from './random-pick-provider/random-pick-provider';
import { useRandomPickState } from './random-pick-provider/random-pick-provider.hooks';

// NOTE: PlayGround은 예시로 승민쌤이 작업하실 때 컴포넌트를 분리하여 작업하시면됩니다.
// PlayGround라는 컴포넌트 명도 예시이며 더 알맞는 컴포넌트명으로 바꾸시면 됩니담
function PlayGround() {
  const {
    options: { isExcludingSelected, isHideResult, sortSelectedStudent },
    pickList,
    pickType,
    // random-pick의 상태를 가져와 학생 랜덤 뽑기를 구현하면 됩니다.
  } = useRandomPickState();

  return (
    <div className="flex flex-col">
      <span>isHideResult: {String(isHideResult)}</span>
      <span>isExcludingSelected: {String(isExcludingSelected)}</span>
      <span>sortSelectedStudent: {sortSelectedStudent}</span>
      <span>pickType: {pickType}</span>
      <span>pickList: {pickList[pickType].join(', ')}</span>
    </div>
  );
}

export default function RandomPickContainer() {
  return (
    <RandomPickProvider>
      <span>랜덤뽑기</span>
      <PlayGround />
      <Sheet modal={false}>
        <SheetTrigger asChild>
          <Button
            variant="primary-ghost"
            className="fixed max-sm:top-2 max-sm:right-2 top-4 right-4 max-sm:size-6 max-sm:p-1 size-12 lg:size-20 p-2 lg:p-3 rounded-full"
          >
            <SettingsIcon className="max-sm:size-4 size-8 lg:size-16" />
          </Button>
        </SheetTrigger>
        <RandomPickSetting />
      </Sheet>
    </RandomPickProvider>
  );
}

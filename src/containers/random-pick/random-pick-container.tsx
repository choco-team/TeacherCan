'use client';

import { Button } from '@/components/button';
import { SettingsIcon } from 'lucide-react';
import DualPanel from '@/components/dual-panel';
import RandomPickSetting from './random-pick-setting/random-pick-setting';
import RandomPickProvider from './random-pick-provider/random-pick-provider';
import PlayGround from './playground/playground';
import RandomPickPlaygroundProvider from './random-pick-playground-provider.tsx/random-pick-playground-provider';

export default function RandomPickContainer() {
  return (
    <RandomPickProvider>
      <RandomPickPlaygroundProvider>
        <DualPanel.Root>
          <DualPanel.Main>
            <PlayGround />
          </DualPanel.Main>
          <DualPanel.Side>
            <DualPanel.Trigger asChild>
              <Button
                variant="primary-ghost"
                className="fixed max-sm:top-2 max-sm:right-2 top-4 right-4 max-sm:size-6 max-sm:p-1 size-12 lg:size-20 p-2 lg:p-3 rounded-full"
              >
                <SettingsIcon className="max-sm:size-4 size-8 lg:size-16" />
              </Button>
            </DualPanel.Trigger>
            <RandomPickSetting />
          </DualPanel.Side>
        </DualPanel.Root>
      </RandomPickPlaygroundProvider>
    </RandomPickProvider>
  );
}

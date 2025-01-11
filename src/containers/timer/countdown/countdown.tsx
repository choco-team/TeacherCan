'use client';

import { Button } from '@/components/button';
import { ExpandIcon, SettingsIcon } from 'lucide-react';
import DualPanel from '@/components/dual-panel';
import CountdownProvider from './countdown-provider/countdown-provider';
import CountdownMusicProvider from './countdown-music-provider/countdown-music-provider';
import CountdownAlarmProvider from './countdown-alarm-provider/countdown-alarm-provider';
import CountdownSetting from './countdown-setting/countdown-setting';
import CountdownDisplay from './countdown-display/countdown-display';
import CountdownMusic from './countdown-music/countdown-music';
import { resizeBrowserSizeByScreen } from './countdown-setting/setting-screen-size/setting-screen-size.utils';

export default function Countdown() {
  return (
    <CountdownProvider>
      <CountdownMusicProvider>
        <CountdownAlarmProvider>
          <DualPanel.Root defaultOpen>
            <div className="relative flex flex-col items-center justify-center min-h-screen bg-body">
              <DualPanel.Main>
                <CountdownDisplay />
                <CountdownMusic />
              </DualPanel.Main>
            </div>
            <DualPanel.Side>
              <DualPanel.Trigger asChild>
                <Button
                  variant="primary-ghost"
                  className="fixed max-sm:top-2 max-sm:right-2 top-4 right-4 max-sm:size-6 max-sm:p-1 size-12 lg:size-20 p-2 lg:p-3 rounded-full"
                >
                  <SettingsIcon className="max-sm:size-4 size-8 lg:size-16" />
                </Button>
              </DualPanel.Trigger>

              <Button
                variant="primary-ghost"
                className="sm:hidden fixed top-2 right-10 size-6 p-1 rounded-full"
                onClick={resizeBrowserSizeByScreen(1)}
              >
                <ExpandIcon className="size-4" />
              </Button>

              <CountdownSetting />
            </DualPanel.Side>
          </DualPanel.Root>
        </CountdownAlarmProvider>
      </CountdownMusicProvider>
    </CountdownProvider>
  );
}

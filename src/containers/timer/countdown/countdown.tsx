'use client';

import { Button } from '@/components/button';
import { Sheet, SheetTrigger } from '@/components/sheet';
import { SettingsIcon } from 'lucide-react';
import CountdownProvider from './countdown-provider/countdown-provider';
import CountdownMusicProvider from './countdown-music-provider/countdown-music-provider';
import CountdownAlarmProvider from './countdown-alarm-provider/countdown-alarm-provider';
import CountdownSetting from './countdown-setting/countdown-setting';
import CountdownDisplay from './countdown-display/countdown-display';
import CountdownMusic from './countdown-music/countdown-music';

export default function Countdown() {
  return (
    <CountdownProvider>
      <CountdownMusicProvider>
        <CountdownAlarmProvider>
          <div className="relative flex flex-col items-center justify-center min-h-screen bg-body">
            <CountdownDisplay />
            <CountdownMusic />

            <Sheet defaultOpen modal={false}>
              <SheetTrigger asChild>
                <Button
                  variant="primary-ghost"
                  className="fixed top-5 right-5 size-16 p-3 rounded-full"
                >
                  <SettingsIcon className="size-16" />
                </Button>
              </SheetTrigger>

              <CountdownSetting />
            </Sheet>
          </div>
        </CountdownAlarmProvider>
      </CountdownMusicProvider>
    </CountdownProvider>
  );
}

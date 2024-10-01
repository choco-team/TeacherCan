'use client';

import { Button } from '@/components/button';
import { Sheet, SheetTrigger } from '@/components/sheet';
import CountdownSetting from './countdown-setting/countdown-setting';
import CountdownProvider from './countdown-provider/countdown-provider';
import CountdownDisplay from './countdown-display/countdown-display';
import CountdownMusicProvider from './countdown-music-provider/countdown-music-provider';
import CountdownAlarmProvider from './countdown-alarm-provider/countdown-alarm-provider';

export default function Countdown() {
  return (
    <CountdownProvider>
      <CountdownMusicProvider>
        <CountdownAlarmProvider>
          <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <Sheet defaultOpen>
              <SheetTrigger asChild>
                <Button variant="primary-ghost">설정</Button>
              </SheetTrigger>
              <CountdownSetting />
            </Sheet>
            <CountdownDisplay />
          </div>
        </CountdownAlarmProvider>
      </CountdownMusicProvider>
    </CountdownProvider>
  );
}

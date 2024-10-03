import { Info as InfoIcon } from 'lucide-react';
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/sheet';
import SettingTime from './setting-time/setting-time';
import SettingAlarm from './setting-alarm/setting-alarm';
import SettingMusic from './setting-music/setting-music';
import SettingScreenSize from './setting-screen-size/setting-screen-size';

export default function CountdownSetting() {
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>타이머 설정</SheetTitle>
        <SheetDescription className="mt-4">
          <span className="flex items-center gap-x-1">
            <InfoIcon className="size-4 text-secondary" />
            타이머 실행 중에도 설정을 변경할 수 있어요.
          </span>
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-12 py-12">
        <SettingTime />
        <SettingAlarm />
        <SettingMusic />
        <SettingScreenSize />
      </div>
    </SheetContent>
  );
}

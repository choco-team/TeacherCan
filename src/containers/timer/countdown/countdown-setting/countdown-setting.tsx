import { Button } from '@/components/button';
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
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
        <SheetTitle>키운트다운 설정</SheetTitle>
        <SheetDescription>
          아래에서 카운트다운 설정을 해보세요. 카운트다운이 진행하는 도중에도
          가능합니다.
        </SheetDescription>
        <div>
          <SettingTime />
          <SettingAlarm />
          <SettingMusic />
          <SettingScreenSize />
        </div>
      </SheetHeader>
      <SheetFooter>
        <SheetClose asChild>
          <Button type="submit">Save changes</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}

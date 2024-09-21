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
          <SettingTime />
          <SettingAlarm />
          <SettingMusic />
          <SettingScreenSize />
        </SheetDescription>
      </SheetHeader>
      <SheetFooter>
        <SheetClose asChild>
          <Button type="submit">Save changes</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}

import { Button } from '@/components/button';
import { SheetContent, SheetHeader, SheetTitle } from '@/components/sheet';
import SettingPickType from './setting-pick-type/setting-pick-type';
import SettingOptions from './setting-options/setting-options';
import { useRandomPickPlaygroundAction } from '../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';

export default function RandomPickSetting() {
  const { resetPick } = useRandomPickPlaygroundAction();
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>랜덤뽑기 설정</SheetTitle>
      </SheetHeader>

      <div className="space-y-10 py-10">
        <SettingPickType />
        <SettingOptions />
        <Button
          onClick={resetPick}
          size="lg"
          variant="primary-outline"
          className="w-full"
        >
          뽑기 초기화
        </Button>
      </div>
    </SheetContent>
  );
}

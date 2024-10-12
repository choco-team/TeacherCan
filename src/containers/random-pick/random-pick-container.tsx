import { Button } from '@/components/button';
import { Sheet, SheetTrigger } from '@/components/sheet';
import { SettingsIcon } from 'lucide-react';
import RandomPickSetting from './random-pick-setting/random-pick-setting';

export default function RandomPickContainer() {
  return (
    <div>
      <span>랜덤뽑기</span>
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
    </div>
  );
}

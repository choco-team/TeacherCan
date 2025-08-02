'use client';

import { Heading1 } from '@/components/heading';
import FontSizeSetting from './font-size-setting/font-size-setting';
import ScreenModeSetting from './screen-mode-setting/screen-mode-setting';

export default function SettingContainer() {
  return (
    <div className="max-w-screen-sm w-full mx-auto items-start">
      <Heading1 className="font-semibold mb-10">
        더 편한 화면으로 꾸며보세요.
      </Heading1>
      <div className="flex flex-col gap-8">
        <FontSizeSetting />
        <ScreenModeSetting />
      </div>
    </div>
  );
}

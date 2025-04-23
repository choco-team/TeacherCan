import { Heading1 } from '@/components/heading';
import FontSizeSetting from './font-size-setting/font-size-setting';
import ScreenModeSetting from './screen-mode-setting/screen-mode-setting';

type Props = {
  initialFontSize: 'small' | 'medium' | 'large';
  initialScreenMode: 'light' | 'dark';
};

export default function SettingContainer({
  initialFontSize,
  initialScreenMode,
}: Props) {
  return (
    <div className="max-w-[600px] w-full mx-auto items-start">
      <Heading1 className="font-semibold mb-10">
        더 편한 화면으로 꾸며보세요.
      </Heading1>
      <div className="flex flex-col gap-8">
        <FontSizeSetting initialFontSize={initialFontSize} />
        <ScreenModeSetting initialScreenMode={initialScreenMode} />
      </div>
    </div>
  );
}

import { Heading4 } from '@/components/heading';
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
    <div className="max-w-[600px] mx-auto items-start">
      <Heading4 className="font-semibold mb-10 text-text-title">
        선생님께 더 편한 화면을 만들어드릴게요.
      </Heading4>
      <div className="flex flex-col gap-8">
        <FontSizeSetting initialFontSize={initialFontSize} />
        <ScreenModeSetting initialScreenMode={initialScreenMode} />
      </div>
    </div>
  );
}

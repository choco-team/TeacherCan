import { Button } from '@/components/button';
import { resizeBrowserSizeByScreen } from './setting-screen-size.utils';

const SCREEN_SIZE = {
  전체화면: 1,
  '1 / 2': 1 / 2,
  '1 / 4': 1 / 4,
};

export default function SettingScreenSize() {
  return (
    <div>
      <span>화면 너비</span>
      <div className="w-full grid grid-cols-3 gap-4">
        {Object.entries(SCREEN_SIZE).map(([key, value]) => (
          <Button
            value={value}
            key={key}
            variant="primary-outline"
            size="sm"
            onClick={resizeBrowserSizeByScreen(value)}
          >
            {key}
          </Button>
        ))}
      </div>
    </div>
  );
}

import SettingContainer from '@/containers/setting/setting-container';
import { headers } from 'next/headers';

export const metadata = {
  title: '설정',
};

export default function Setting() {
  const headersList = headers();
  const initialFontSize = headersList.get('X-Font-Size') as
    | 'small'
    | 'medium'
    | 'large';
  const initialScreenMode = headersList.get('X-Screen-Mode') as
    | 'light'
    | 'dark';

  return (
    <SettingContainer
      initialFontSize={initialFontSize}
      initialScreenMode={initialScreenMode}
    />
  );
}

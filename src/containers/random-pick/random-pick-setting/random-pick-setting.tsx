import { Button } from '@/components/button';
import DualPanel from '@/components/dual-panel';
import SettingPickType from './setting-pick-type/setting-pick-type';
import SettingOptions from './setting-options/setting-options';
import { useRandomPickPlaygroundAction } from '../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';

export default function RandomPickSetting() {
  const { resetPick } = useRandomPickPlaygroundAction();
  return (
    <DualPanel.Content>
      <DualPanel.Header>
        <DualPanel.Title>랜덤뽑기 설정</DualPanel.Title>
      </DualPanel.Header>

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
    </DualPanel.Content>
  );
}

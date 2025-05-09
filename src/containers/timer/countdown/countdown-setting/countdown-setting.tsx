import { Info as InfoIcon } from 'lucide-react';
import DualPanel from '@/components/dual-panel';
import { Button } from '@/components/button';
import SmallPlayerIcon from '@/assets/icons/SmallPlayerIcon';
import SettingTime from './setting-time/setting-time';
import SettingAlarm from './setting-alarm/setting-alarm';
import SettingMusic from './setting-music/setting-music';
import SettingScreenSize from './setting-screen-size/setting-screen-size';
import CountdownPIP from '../countdown-pip/countdown-pip';
import { useCountdownState } from '../countdown-provider/countdown-provider.hooks';

export default function CountdownSetting() {
  const { hours, minutes, seconds } = useCountdownState();

  return (
    <DualPanel.Content>
      <DualPanel.Header>
        <DualPanel.Title>타이머 설정</DualPanel.Title>
        <DualPanel.Description className="mt-4">
          <span className="flex gap-x-1 text-start">
            <InfoIcon className="mt-0.5 size-4 text-secondary" />
            타이머 실행 중에도 설정을 변경할 수 있어요.
          </span>
        </DualPanel.Description>
      </DualPanel.Header>

      <div className="space-y-10 py-10">
        <SettingTime />
        <SettingAlarm />
        <SettingMusic />
        <SettingScreenSize />
      </div>
      <DualPanel.Footer>
        <CountdownPIP
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          action={
            <Button variant="primary-ghost" size="sm" className="p-0">
              <SmallPlayerIcon
                width="32px"
                height="32px"
                className="text-text-title"
              />
            </Button>
          }
        />
      </DualPanel.Footer>
    </DualPanel.Content>
  );
}

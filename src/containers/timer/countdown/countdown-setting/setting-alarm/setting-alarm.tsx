import { useState } from 'react';
import { BellRingIcon, PlayIcon, ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/checkbox';
import { Switch } from '@/components/switch';
import { Label } from '@/components/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover';
import DualPanel from '@/components/dual-panel';
import {
  useCountdownAlarmAction,
  useCountdownAlarmState,
} from '../../countdown-alarm-provider/countdown-alarm-provider.hooks';
import { useCountdownState } from '../../countdown-provider/countdown-provider.hooks';
import { ALARM_SOUNDS } from '../../countdown-alarm-provider/countdown-alarm-provider.constants';

const ALARM_TIMES = [60 * 10, 60 * 5, 60 * 1, 10] as const;
const DEFAULT_ALARM_VALUE = 0 as const;

export default function SettingAlarm() {
  const { alarmTimes, selectedAlarmSound } = useCountdownAlarmState();
  const { toggleAlarmTime, selectAlarmSound, previewAlarmSound } =
    useCountdownAlarmAction();
  const { leftTime } = useCountdownState();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-y-4">
      <DualPanel.SubTitle>
        <BellRingIcon />
        종료 알림
      </DualPanel.SubTitle>
      <Label className="flex items-center justify-between gap-x-2">
        <span className="text-text-subtitle">타이머 종료 시 알림음 울리기</span>
        <Switch
          checked={alarmTimes.includes(DEFAULT_ALARM_VALUE)}
          onClick={toggleAlarmTime(DEFAULT_ALARM_VALUE)}
        />
      </Label>

      <div className="flex items-center gap-x-4">
        <span className="text-sm text-text-subtitle font-medium leading-none">
          알림음
        </span>
        <div className="flex-grow flex items-center gap-x-2">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger className="flex-1 flex items-center gap-x-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus:ring-zinc-300">
              <span className="flex-grow text-start">
                {selectedAlarmSound.label}
              </span>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  previewAlarmSound(selectedAlarmSound.value);
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
              >
                <PlayIcon className="size-3 text-primary fill-primary" />
              </button>
              <ChevronDown className="size-4 opacity-50 text-text-title" />
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <div className="flex flex-col">
                {ALARM_SOUNDS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      selectAlarmSound(value);
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-between px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <span>{label}</span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        previewAlarmSound(value);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                    >
                      <PlayIcon className="size-3 text-primary fill-primary" />
                    </button>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <h4 className="text-text-title font-semibold">미리 알림</h4>
        <div className="max-sm:grid grid-cols-2 sm:flex items-center gap-2">
          {ALARM_TIMES.map((time) => (
            <Label
              key={time}
              className="flex-1 flex items-center gap-x-1.5 text-text-subtitle"
            >
              <Checkbox
                value={time}
                checked={alarmTimes.includes(time)}
                disabled={leftTime <= time}
                onClick={toggleAlarmTime(time)}
              />
              {`${time >= 60 ? `${time / 60}분` : `${time}초`} 전`}
            </Label>
          ))}
        </div>
      </div>
    </div>
  );
}

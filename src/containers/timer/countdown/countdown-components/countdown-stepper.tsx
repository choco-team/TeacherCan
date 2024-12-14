import { useRef, type FocusEvent, type ChangeEvent } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Button } from '@/components/button';
import { cn } from '@/styles/utils';
import { InputNumberWithoutSpin } from './countdown-input';

const timeInputClassName =
  'px-2 md:px-4 md:pb-2 lg:p-6 pt-4 md:pt-6 lg:pt-10 max-w-32 md:max-w-60 lg:max-w-96 text-7xl md:text-9xl lg:text-[13rem] h-auto md:rounded-2xl lg:rounded-3xl bg-white read-only:border-body read-only:bg-body read-only:pointer-events-none text-end font-medium font-number leading-none md:tracking-wide';

type Props = {
  value: number;
  isActive: boolean;
  disabledUp: boolean;
  disabledDown: boolean;
  length?: number;
  className?: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onChange: (value: number) => void;
};

export default function CountdownStepper({
  value,
  isActive,
  disabledUp,
  disabledDown,
  className,
  length = 2,
  onIncrease,
  onDecrease,
  onChange,
}: Props) {
  const formatTimeToTwoDigits = (time: number) =>
    time.toString().padStart(length, '0');

  const holdTimeout = useRef<NodeJS.Timeout | null>(null);
  const holdSpeed = useRef(300);

  const startHold = (callback: () => void) => {
    const repeatCallback = () => {
      callback();
      holdSpeed.current = Math.max(holdSpeed.current * 0.92, 30);
      holdTimeout.current = setTimeout(repeatCallback, holdSpeed.current);
    };

    callback();
    holdSpeed.current = 300;
    holdTimeout.current = setTimeout(repeatCallback, holdSpeed.current);
  };

  const stopHold = () => {
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current);
      holdTimeout.current = null;
    }

    holdSpeed.current = 300;
  };

  const handleBlur =
    (time: number, formatter?: (time: number) => string) =>
    (event: FocusEvent<HTMLInputElement>) => {
      // eslint-disable-next-line no-param-reassign
      event.target.value = formatter ? formatter(time) : time.toString();
    };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    if (isActive) return;
    // eslint-disable-next-line no-param-reassign
    event.target.value = '';
  };

  return (
    <div className="flex flex-col items-center gap-y-1.5 lg:gap-y-4">
      <Button
        size="icon"
        variant="primary-ghost"
        className="max-md:hidden size-6 lg:size-12 rounded-full"
        disabled={disabledUp}
        onMouseDown={() => startHold(onIncrease)}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
      >
        <ChevronUpIcon className="size-5 lg:size-8" />
      </Button>
      <InputNumberWithoutSpin
        value={formatTimeToTwoDigits(value)}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(Math.floor(Number(event.target.value)))
        }
        onFocus={handleFocus}
        onBlur={handleBlur(value, formatTimeToTwoDigits)}
        className={cn(timeInputClassName, className)}
        readOnly={isActive}
      />
      <Button
        size="icon"
        variant="primary-ghost"
        className="max-md:hidden size-6 lg:size-12 rounded-full"
        disabled={disabledDown}
        onMouseDown={() => startHold(onDecrease)}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
      >
        <ChevronDownIcon className="size-5 lg:size-8" />
      </Button>
    </div>
  );
}

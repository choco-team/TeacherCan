import { LucideProps, PickaxeIcon, QrCodeIcon, TimerIcon } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export const ROUTE = {
  LANDING: '/',
  QR_CODE: '/qr-code',
  TIMER: '/timer',
  RANDOM_PICK: '/random-pick',
} as const;

export type RoutePath = (typeof ROUTE)[keyof typeof ROUTE];

export const PATH_DATA: Partial<
  Record<
    RoutePath,
    {
      title: string;
      Icon: ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
      >;
    }
  >
> = {
  '/qr-code': {
    title: 'QR코드',
    Icon: QrCodeIcon,
  },
  '/random-pick': {
    title: '랜덤뽑기',
    Icon: PickaxeIcon,
  },
  '/timer': {
    title: '타이머',
    Icon: TimerIcon,
  },
};

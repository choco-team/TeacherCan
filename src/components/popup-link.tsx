'use client';

import { cn } from '@/styles/utils';
import { getScreenSize } from '@/utils/getScreenSize';
import Link from 'next/link';
import { ComponentPropsWithoutRef } from 'react';

const POPUP_SCALE = {
  'x-large': 1,
  large: 2 / 3,
  medium: 1 / 2,
  small: 1 / 3,
  'x-small': 1 / 4,
} as const;

type Props = {
  url: string;
  size?: keyof typeof POPUP_SCALE | number;
} & ComponentPropsWithoutRef<'div'>;

function PopupLink({
  children,
  url,
  size = 'medium',
  className,
  ...rest
}: Props) {
  const handleClick = () => {
    const { width, height } = getScreenSize();

    const scale = typeof size === 'number' ? size : POPUP_SCALE[size];

    const popupWidth = width * scale;
    const popupHeight = height * scale;

    const top = Math.round(height / 2 - popupHeight / 2);
    const left = Math.round(width / 2 - popupWidth / 2);

    const popupName = `popup_${new Date().getTime()}`;

    window.open(
      url,
      popupName,
      `top=${top},left=${left},width=${popupWidth},height=${popupHeight}`,
    );
  };

  return (
    <div
      onClick={handleClick}
      {...rest}
      className={cn(className, 'cursor-pointer')}
    >
      <Link href="/timer" onClick={(e) => e.preventDefault()}>
        {children}
      </Link>
    </div>
  );
}

export default PopupLink;

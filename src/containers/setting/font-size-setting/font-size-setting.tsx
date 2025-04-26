'use client';

import { Skeleton } from '@/components/skeleton';
import { getCookieValue } from '@/utils/getCookieValue';
import { cva } from 'class-variance-authority';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const fontValues: {
  size: string;
  label: string;
  value: 'small' | 'medium' | 'large';
}[] = [
  { size: '14', label: '작게', value: 'small' },
  { size: '16', label: '보통', value: 'medium' },
  { size: '18', label: '확대', value: 'large' },
];

const fontSizeBoxVariants = cva(
  'aspect-square border-2 rounded-lg cursor-pointer flex flex-col gap-2 items-center justify-center',
  {
    variants: {
      selected: {
        true: 'border-primary-500 text-primary-500 font-bold',
        false:
          'border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400',
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
);

const fontSizeLabelVariants = cva(
  'text-sm h-[26px] flex items-center justify-center',
  {
    variants: {
      selected: {
        true: 'text-primary-500 font-bold',
        false: 'text-gray-500',
      },
    },
  },
);

export default function FontSizeSetting() {
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>(
    getCookieValue<'small' | 'medium' | 'large'>('fontSize'),
  );

  const handleClickFontSize = (size: 'small' | 'medium' | 'large') => {
    setFontSize(size);
    Cookies.set('fontSize', size, { expires: 3650 });
  };

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.classList.remove('small', 'medium', 'large');
    htmlElement.classList.add(fontSize);
  }, [fontSize]);

  useEffect(() => {
    if (fontSize) {
      return;
    }

    setFontSize(
      (Cookies.get('fontSize') as 'small' | 'medium' | 'large') || 'medium',
    );
  }, [fontSize]);

  return (
    <div className="flex flex-col gap-[12px] w-full">
      <div className="font-semibold text-sm h-[30px] text-text-title">
        글씨크기
      </div>

      {!fontSize ? (
        <div className="w-full flex-1 grid grid-cols-3 gap-x-[16px]">
          {Array.from({ length: 3 }).map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index} className="flex flex-col gap-4">
              <Skeleton className="w-full aspect-square" />
              <Skeleton className="w-16 h-[26px] self-center" />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full flex-1 grid grid-cols-3 gap-x-[16px]">
          {fontValues.map(({ size, label, value }) => {
            const selected = fontSize === value;

            return (
              <div key={size} className="flex flex-col gap-4">
                <div
                  onClick={() => handleClickFontSize(value)}
                  className={fontSizeBoxVariants({
                    selected,
                  })}
                  style={{ fontSize: `${size}px`, position: 'relative' }}
                >
                  <span>가나다</span>
                </div>
                <div
                  className={fontSizeLabelVariants({
                    selected,
                  })}
                >
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

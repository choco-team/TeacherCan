'use client';

import useLocalStorage from '@/hooks/useLocalStorage';
import { cva } from 'class-variance-authority';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

const fontValues: {
  size: string;
  label: string;
  value: 'small' | 'medium' | 'large';
}[] = [
  { size: '14', label: '축소', value: 'small' },
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

type Props = {
  initialFontSize: 'small' | 'medium' | 'large';
};

export default function FontSizeSetting({ initialFontSize }: Props) {
  const [fontSize, setFontSize] = useLocalStorage<'small' | 'medium' | 'large'>(
    'fontSize',
    initialFontSize,
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

  return (
    <div className="flex flex-col gap-[12px] w-full">
      <div className="font-semibold text-sm h-[30px] text-text-title">
        글씨크기
      </div>
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
    </div>
  );
}

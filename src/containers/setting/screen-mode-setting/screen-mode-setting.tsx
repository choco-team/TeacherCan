'use client';

import { getCookieValue } from '@/utils/getCookieValue';
import theme from '@/styles/theme';
import { cva } from 'class-variance-authority';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/skeleton';

const screenModeValues: {
  label: string;
  value: 'light' | 'dark';
}[] = [
  { label: '라이트 모드', value: 'light' },
  { label: '다크 모드', value: 'dark' },
];

const screenModeBoxVariants = cva(
  'aspect-square border-2 rounded-lg cursor-pointer flex flex-col gap-2 justify-center',
  {
    variants: {
      selected: {
        true: 'border-primary-500',
        false: 'border-gray-200 dark:border-gray-800',
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

export default function ScreenModeSetting() {
  const [screenMode, setScreenMode] = useState<'light' | 'dark'>(
    getCookieValue<'light' | 'dark'>('screenMode'),
  );

  const handleClickScreenMode = (_screenMode: 'light' | 'dark') => {
    setScreenMode(_screenMode);
    Cookies.set('screenMode', _screenMode, { expires: 3650 });
  };

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.classList.remove('light', 'dark', 'system');
    htmlElement.classList.add(screenMode);
  }, [screenMode]);

  useEffect(() => {
    if (screenMode) {
      return;
    }

    setScreenMode((Cookies.get('screenMode') as 'light' | 'dark') || 'light');
  }, [screenMode]);

  return (
    <div className="flex flex-col gap-[12px] w-full">
      <div className="font-semibold text-sm h-[30px] text-text-title">
        화면모드
      </div>

      {!screenMode ? (
        <div className="w-full flex-1 grid grid-cols-3 gap-x-[16px]">
          {Array.from({ length: 2 }).map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index} className="flex flex-col gap-4">
              <Skeleton className="w-full aspect-square" />
              <Skeleton className="w-16 h-[26px] self-center" />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full flex-1 grid grid-cols-3 gap-x-[16px]">
          {screenModeValues.map(({ label, value }) => {
            const selected = screenMode === value;

            return (
              <div key={value} className="flex flex-col gap-4">
                <div
                  onClick={() => handleClickScreenMode(value)}
                  className={screenModeBoxVariants({
                    selected,
                  })}
                  style={{
                    position: 'relative',
                    padding: '12px',
                    backgroundColor:
                      value === 'light'
                        ? theme.colors.white
                        : theme.colors.gray[950],
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      borderRadius: '8px',
                      backgroundColor: theme.colors.primary[500],
                    }}
                  />
                  <div
                    style={{
                      width: '60%',
                      height: '8px',
                      borderRadius: '8px',
                      backgroundColor:
                        value === 'light'
                          ? theme.colors.gray[900]
                          : theme.colors.gray[50],
                    }}
                  />
                  <div
                    style={{
                      width: '80%',
                      height: '8px',
                      borderRadius: '8px',
                      backgroundColor:
                        value === 'light'
                          ? theme.colors.gray[700]
                          : theme.colors.gray[400],
                    }}
                  />
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      borderRadius: '8px',
                      backgroundColor: theme.colors.gray[500],
                    }}
                  />
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

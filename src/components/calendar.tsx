/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-unstable-nested-components */

'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/styles/utils';
import { buttonVariants } from '@/components/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'p-3 shadow-custom dark:shadow-custom-dark dark:border dark:border-gray-600 bg-bg-origin',
        className,
      )}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium text-gray-900 dark:text-gray-100',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'gray-outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-gray-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-gray-400',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-100/50 dark:[&:has([aria-selected].day-outside)]:bg-gray-800/50 [&:has([aria-selected])]:bg-gray-100 dark:[&:has([aria-selected])]:bg-gray-800 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'gray-ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800',
        ),
        day_range_end: 'day-range-end',
        day_selected:
          'bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white dark:bg-white dark:text-gray-900 dark:hover:bg-white dark:hover:text-gray-900 dark:focus:bg-white dark:focus:text-gray-900',
        day_today:
          'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
        day_outside:
          'day-outside text-gray-500 aria-selected:bg-gray-100/50 aria-selected:text-gray-500 dark:text-gray-400 dark:aria-selected:bg-gray-800/50 dark:aria-selected:text-gray-400',
        day_disabled: 'text-gray-500 opacity-50 dark:text-gray-400',
        day_range_middle:
          'aria-selected:bg-gray-100 aria-selected:text-gray-900 dark:aria-selected:bg-gray-800 dark:aria-selected:text-gray-100',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn('h-4 w-4', className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn('h-4 w-4', className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };

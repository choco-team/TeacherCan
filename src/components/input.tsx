import * as React from 'react';

import { cn } from '@/styles/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, maxLength, onChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      if (typeof maxLength === 'number' && value.length > maxLength) {
        return;
      }

      if (typeof onChange === 'function') onChange(event);
    };

    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border text-text-title border-input dark:border-gray-700 dark:bg-gray-950 px-3 py-2 text-sm ring-offset-white dark:ring-offset-black file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-disabled dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        maxLength={maxLength}
        onChange={handleChange}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };

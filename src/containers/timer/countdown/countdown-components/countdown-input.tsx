import * as React from 'react';
import { Input } from '@/components/input';
import { cn } from '@/styles/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  maxValue?: number;
}

const InputWithoutSpin = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, onFocus, maxValue = 59, onChange, ...props }, ref) => {
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.value = '';
      if (onFocus) onFocus(e);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);

      if (value > maxValue) {
        e.target.value = maxValue.toString();
      }

      if (onChange) onChange(e);
    };

    return (
      <Input
        className={cn(
          'appearance-none',
          '[-moz-appearance:textfield]',
          '[&::-webkit-outer-spin-button]:appearance-none',
          '[&::-webkit-inner-spin-button]:appearance-none',
          className,
        )}
        ref={ref}
        onChange={handleChange}
        onFocus={handleFocus}
        {...props}
      />
    );
  },
);

InputWithoutSpin.displayName = 'InputWithoutSpin';

export { InputWithoutSpin };

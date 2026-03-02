import * as React from 'react';
import { Input } from '@/components/input';
import { cn } from '@/styles/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  maxValue?: number;
}

const InputNumberWithoutSpin = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        type="number"
        className={cn(
          'appearance-none',
          '[-moz-appearance:textfield]',
          '[&::-webkit-outer-spin-button]:appearance-none',
          '[&::-webkit-inner-spin-button]:appearance-none',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

InputNumberWithoutSpin.displayName = 'InputNumberWithoutSpin';

export { InputNumberWithoutSpin };

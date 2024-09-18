import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/styles/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary-600',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/90 active:bg-secondary-600',
        red: 'bg-red text-red-foreground hover:bg-red/90 active:bg-red-600',
        'primary-outline':
          'border border-primary text-primary hover:bg-primary-100 hover:border-primary-600 hover:text-primary-600 active:bg-primary-200 active:border-primary-700 active:text-primary-700',
        'secondary-outline':
          'border border-secondary text-secondary hover:bg-secondary-100 hover:border-secondary-600 hover:text-secondary-600 active:bg-secondary-200 active:border-secondary-700 active:text-secondary-700',
        'gray-outline':
          'border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-800 active:bg-gray-200 active:border-gray-500 active:text-gray-900',
        'primary-ghost':
          'text-primary hover:bg-primary-100 hover:text-primary-600 active:bg-primary-200 active:text-primary-700',
        'primary-link':
          'text-primary underline-offset-4 hover:underline active:text-primary-600',
      },
      size: {
        sm: 'h-9 rounded-md px-3',
        md: 'h-10 px-4 py-2',
        lg: 'min-w-28 h-11 rounded-md px-8 font-semibold',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };

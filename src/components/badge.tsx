import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/styles/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border font-semibold',
  {
    variants: {
      variant: {
        primary: 'border-transparent bg-primary-100 text-primary',
        secondary: 'border-transparent bg-secondary-100 text-secondary',
        'primary-outline': 'border-primary text-primary',
        'secondary-outline': 'border-secondary text-secondary',
      },
      size: {
        md: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 h-5 text-xs',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

import type { HTMLAttributes } from 'react';
import { cn } from '@/styles/utils';

export function Heading1({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        'flex items-center gap-x-3 text-2xl font-bold',
        'max-sm:text-1.5xl',
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function Heading2({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn('text-lg font-semibold', className)} {...props}>
      {children}
    </h2>
  );
}

export function Heading3({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('font-semibold', className)} {...props}>
      {children}
    </h3>
  );
}

export function Heading4({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4 className={cn('text-sm font-semibold', className)} {...props}>
      {children}
    </h4>
  );
}

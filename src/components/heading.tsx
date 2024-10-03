import type { HTMLAttributes } from 'react';

export function Heading1({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={`scroll-m-20 text-4xl font-extrabold ${className ? ` ${className}` : ''}`}
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
    <h2
      className={`scroll-m-20 text-2.5xl font-bold${className ? ` ${className}` : ''}`}
      {...props}
    >
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
    <h3
      className={`scroll-m-20 text-2xl font-bold${className ? ` ${className}` : ''}`}
      {...props}
    >
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
    <h4
      className={`scroll-m-20 text-xl font-semibold${className ? ` ${className}` : ''}`}
      {...props}
    >
      {children}
    </h4>
  );
}

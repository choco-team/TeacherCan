import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('X-Current-Path', request.nextUrl.pathname);
  response.headers.set(
    'X-Font-Size',
    request.cookies.get('fontSize')?.value ?? 'medium',
  );
  response.headers.set(
    'X-Screen-Mode',
    request.cookies.get('screenMode')?.value ?? 'light',
  );

  return NextResponse.rewrite(request.nextUrl, { headers: response.headers });
}

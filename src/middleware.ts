import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('X-Current-Path', request.nextUrl.pathname);

  return NextResponse.rewrite(request.nextUrl, { headers: response.headers });
}

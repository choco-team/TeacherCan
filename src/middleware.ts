import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 관리자 페이지는 로컬 개발 환경에서만 노출한다.
  // 운영에서는 존재 자체를 드러내지 않도록 리다이렉트가 아닌 404 로 응답한다.
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    process.env.NODE_ENV !== 'development'
  ) {
    return new NextResponse(null, { status: 404 });
  }

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

import './globals.css';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from '@/components/toaster';
import { headers } from 'next/headers';
import Header from '@/components/header/header';
import QueryProvider from '@/components/provider/query-provider';
import { MENU_ROUTE } from '@/constants/route';
import { cn } from '@/styles/utils';
import { SidebarProvider } from '@/components/sidebar';
import AppSidebar from '@/components/app-sidebar/app-sidebar';
import Script from 'next/script';

export const metadata: Metadata = {
  title: '티처캔',
  description: '선생님의 학교생활을 도와요',
  icons: {
    icon: '/favicon.ico',
  },
};

const pretendard = localFont({
  src: '../assets/fonts/pretendard-variable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

const byeolbichhaneul = localFont({
  src: '../assets/fonts/hakgyoansim-byeolbichhaneul-B.woff',
  variable: '--font-byeolbichhaneul',
});

const pyeongtaek = localFont({
  src: '../assets/fonts/pyeongtaek-anbo-regular.woff',
  variable: '--font-pyeongtaek-anbo',
});

const isMinimalLayoutPages = {
  startsWith: ['/timer', '/music-request/student/'],
  equal: [MENU_ROUTE.NOTICE],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const currentPath = headersList.get('X-Current-Path') || '/';
  const fontSize = headersList.get('X-Font-Size');
  const screenMode = headersList.get('X-Screen-Mode');

  const isMinimalLayout =
    isMinimalLayoutPages.startsWith.some((path) =>
      currentPath.startsWith(path),
    ) || isMinimalLayoutPages.equal.some((path) => path === currentPath);

  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${byeolbichhaneul.variable} ${pyeongtaek.variable} ${fontSize} ${screenMode}`}
    >
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_TAG_ID} />
      <body className="bg-bg">
        <Script
          id="theme-sync"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              try {
                // 쿠키에서 현재 설정값 가져오기
                function getCookie(name) {
                  const value = \` \${document.cookie}\`;
                  const parts = value.split(\` \${name}=\`);
                  if (parts.length === 2) return parts.pop().split(';').shift();
                  return null;
                }
                
                const currentScreenMode = getCookie('screenMode') || 'light';
                const currentFontSize = getCookie('fontSize') || 'medium';
                
                // HTML 요소에 클래스 적용
                const html = document.documentElement;
                
                // 기존 클래스 제거 후 새로운 클래스 추가
                html.classList.remove('light', 'dark', 'system');
                html.classList.remove('small', 'medium', 'large');
                html.classList.add(currentScreenMode);
                html.classList.add(currentFontSize);
              } catch (e) {
                console.error('Theme sync error:', e);
              }
            })();
          `,
          }}
        />
        <QueryProvider>
          {isMinimalLayout ? (
            <main className="bg-gray-50 dark:bg-gray-950">
              <div>{children}</div>
            </main>
          ) : (
            <SidebarProvider>
              <AppSidebar />
              <main className="w-full bg-bg">
                <Header />
                <div
                  className={cn(
                    'flex flex-col min-h-dvh',
                    'pt-16 px-6 pb-8',
                    'lg:pt-20 lg:px-8',
                  )}
                >
                  {children}
                </div>
              </main>
            </SidebarProvider>
          )}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}

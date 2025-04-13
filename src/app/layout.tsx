import './globals.css';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from '@/components/toaster';
import { headers } from 'next/headers';
import Header from '@/components/header/header';
import QueryProvider from '@/components/provider/query-provider';
import { MENU_ROUTE } from '@/constants/route';
import { SidebarProvider } from '@/components/sidebar';
import AppSidebar from '@/components/app-sidebar/app-sidebar';

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

  const isMinimalLayout =
    isMinimalLayoutPages.startsWith.some((path) =>
      currentPath.startsWith(path),
    ) || isMinimalLayoutPages.equal.some((path) => path === currentPath);

  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${byeolbichhaneul.variable} ${pyeongtaek.variable} ${fontSize}`}
    >
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_TAG_ID} />
      <body>
        <QueryProvider>
          {isMinimalLayout ? (
            <main className="bg-beige-50">
              <div>{children}</div>
            </main>
          ) : (
            <SidebarProvider>
              <AppSidebar />
              <main className="bg-body w-full">
                <Header />
                <div className="pt-[68px] px-4 mb-8">{children}</div>
              </main>
            </SidebarProvider>
          )}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}

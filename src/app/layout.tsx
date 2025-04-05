import './globals.css';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from '@/components/toaster';
import { headers } from 'next/headers';
import Navigation from '@/components/navigation/navigation';
import Header from '@/components/header/header';
import QueryProvider from '@/components/provider/query-provider';

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

const isMinimalLayoutPages = ['/timer', '/music-request/student/'];

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const currentPath = headersList.get('X-Current-Path') || '/';

  const isMinimalLayout = isMinimalLayoutPages.some((path) =>
    currentPath.startsWith(path),
  );

  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${byeolbichhaneul.variable} ${pyeongtaek.variable}`}
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
            <>
              <Navigation />
              <main
                id="teacher-can-main"
                className="bg-body transition-all ease-in-out duration-500 lg:data-[status=closed]:ml-0 lg:ml-[260px]"
              >
                <Header />
                <div className="pt-[68px] px-4 mb-8">{children}</div>
              </main>
            </>
          )}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}

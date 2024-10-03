import type { Metadata } from 'next';
import localFont from 'next/font/local';

import './globals.css';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${byeolbichhaneul.variable} ${pyeongtaek.variable}`}
    >
      <body>
        <div className="w-full min-h-screen">{children}</div>
      </body>
    </html>
  );
}

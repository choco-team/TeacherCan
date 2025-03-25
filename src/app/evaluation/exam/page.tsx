// page.tsx 파일

'use client';

import dynamic from 'next/dynamic';

const QRCodePage = dynamic(() => import('./QRcodePage'), { ssr: false });

export default function QRCodeRoute() {
  return <QRCodePage />;
}

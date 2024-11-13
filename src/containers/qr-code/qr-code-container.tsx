'use client';

import { useRef, useState } from 'react';
import { Heading1 } from '@/components/heading';
import { cn } from '@/styles/utils';
import QRCodeGenerator from './qr-code-generator/qr-code-generator';
import QRCodeDownloader from './qr-code-downloader/qr-code-downloader';
import QRCodeClipboard from './qr-code-clipboard/qr-code-clipboard';
import QRCodeExpansion from './qr-code-expansion/qr-code-expansion';
import QRCodePrinter from './qr-code-printer/qr-code-printer';
import type { QRCode } from './qr-code.type';

function QrCodeContainer() {
  const [qrCode, setQrCode] = useState<QRCode>({ value: '', name: '' });
  const qrCodeRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-y-10 px-6 bg-body">
      <Heading1>QR코드 생성</Heading1>

      <QRCodeGenerator ref={qrCodeRef} qrCode={qrCode} setQrCode={setQrCode} />

      <div className={cn('grid grid-cols-2 gap-4', 'sm:grid-cols-4')}>
        <QRCodeClipboard qrCodeRef={qrCodeRef} qrCode={qrCode} />
        <QRCodeDownloader qrCodeRef={qrCodeRef} qrCode={qrCode} />
        <QRCodePrinter qrCode={qrCode} />
        <QRCodeExpansion qrCode={qrCode} />
      </div>
      <div />
    </div>
  );
}

export default QrCodeContainer;

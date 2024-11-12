'use client';

import { useRef, useState } from 'react';
import { Heading1 } from '@/components/heading';
import QRCodeGenerator from './qr-code-generator/qr-code-generator';
import QRCodeDownloader from './qr-code-downloader/qr-code-downloader';
import QRCodeClipboard from './qr-code-clipboard/qr-code-clipboard';
import QRCodeExpansion from './qr-code-expansion/qr-code-expansion';
import QRCodePrinter from './qr-code-printer/qr-code-printer';

function QrCodeContainer() {
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [qrCodeName, setQrCodeName] = useState('');
  const qrCodeRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-y-10 bg-body">
      <Heading1>QR코드 생성</Heading1>

      <QRCodeGenerator
        setQrCodeValue={setQrCodeValue}
        qrCodeRef={qrCodeRef}
        qrCodeValue={qrCodeValue}
        qrCodeName={qrCodeName}
        setQrCodeName={setQrCodeName}
      />

      <div className="grid grid-cols-4 gap-2">
        <QRCodeDownloader qrCodeRef={qrCodeRef} qrCodeName={qrCodeName} />
        <QRCodeClipboard qrCodeRef={qrCodeRef} qrCodeName={qrCodeName} />
        <QRCodeExpansion qrCodeValue={qrCodeValue} qrCodeName={qrCodeName} />
        <QRCodePrinter qrCodeName={qrCodeName} qrCodeValue={qrCodeValue} />
      </div>
      <div />
    </div>
  );
}

export default QrCodeContainer;

'use client';

import { useRef, useState } from 'react';
import QRCodeGenerator from './qr-code-generator/qr-code-generator';
import QRCodeDownloader from './qr-code-downloader/qr-code-downloader';
import QRCodeClipboard from './qr-code-clipboard/qr-code-clipboard';
import QRCodeExpansion from './qr-code-expansion/qr-code-expansion';
import QRCodePrinter from './qr-code-printer/qr-code-printer';

function QrCodeContainer() {
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [qrCodeName, setQrCodeName] = useState('');
  const qrCodeRef = useRef<HTMLDivElement>(null);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <QRCodeGenerator
          setQrCodeValue={setQrCodeValue}
          qrCodeRef={qrCodeRef}
          qrCodeValue={qrCodeValue}
          qrCodeName={qrCodeName}
          setQrCodeName={setQrCodeName}
          isGenerated={isGenerated}
          setIsGenerated={setIsGenerated}
        />
        <div className="flex justify-center mt-8">
          <QRCodeDownloader qrCodeRef={qrCodeRef} qrCodeName={qrCodeName} />
          <QRCodeClipboard qrCodeRef={qrCodeRef} qrCodeName={qrCodeName} />
          <QRCodeExpansion qrCodeValue={qrCodeValue} qrCodeName={qrCodeName} />
          <QRCodePrinter
            qrCodeValue={qrCodeValue}
            qrCodeRef={qrCodeRef}
            qrCodeName={qrCodeName}
          />
        </div>
        <div />
      </div>
    </div>
  );
}

export default QrCodeContainer;

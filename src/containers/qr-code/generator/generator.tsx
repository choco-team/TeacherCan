'use client';

import { useState } from 'react';
import DynamicQRCodeGenerator from './generator-link/generator-link';
import QRCodeDownloader from './generator-download/generator-downloader';
import QRCodeClipboard from './generator-clipboard/generator-clipboard';
import QRCodeExtansion from './generator-expansion/generator-expansion';

function QRCode() {
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [qrCodeRef, setQrCodeRef] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <DynamicQRCodeGenerator
          setQrCodeValue={setQrCodeValue}
          setQrCodeRef={setQrCodeRef}
          qrCodeValue={qrCodeValue}
        />
        <div className="flex justify-center mt-8">
          <QRCodeDownloader />
          <QRCodeClipboard qrCodeRef={qrCodeRef} />
          <QRCodeExtansion qrCodeValue={qrCodeValue} />
        </div>
      </div>
    </div>
  );
}

export default QRCode;

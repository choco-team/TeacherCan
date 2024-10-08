'use client';

import { useState } from 'react';

import QRCodeLink from './generator-link/generator-link';
import QRCodeDownloader from './generator-downloader/generator-downloader';
import QRCodeClipboard from './generator-clipboard/generator-clipboard';
import QRCodeExpansion from './generator-expansion/generator-expansion';
import QRSavedLinks from './generator-savelink/generator-savedlink';

function QRCodeGenerator() {
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [qrCodeRef, setQrCodeRef] = useState(null);
  const [isGenerated, setIsGenerated] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <QRCodeLink
          setQrCodeValue={setQrCodeValue}
          setQrCodeRef={setQrCodeRef}
          qrCodeValue={qrCodeValue}
          isGenerated={isGenerated}
          setIsGenerated={setIsGenerated}
        />
        <div className="flex justify-center mt-8">
          <QRCodeDownloader />
          <QRCodeClipboard qrCodeRef={qrCodeRef} />
          <QRCodeExpansion qrCodeValue={qrCodeValue} />
        </div>
        <div>
          <QRSavedLinks
            qrCodeValue={qrCodeValue}
            setIsGenerated={setIsGenerated}
            setQrCodeValue={setQrCodeValue}
          />
        </div>
      </div>
    </div>
  );
}

export default QRCodeGenerator;

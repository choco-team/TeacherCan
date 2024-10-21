'use client';

import { useRef, useState } from 'react';
import QRCodeGenerator from './qr-code-generator/qr-code-generator';
import QRCodeDownloader from './qr-code-downloader/qr-code-downloader';
import QRCodeClipboard from './qr-code-clipboard/qr-code-clipboard';
import QRCodeExpansion from './qr-code-expansion/qr-code-expansion';
// import QRSavedLinks from './qr-code-savelink/qr-code-savelink';

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
        </div>
        <div>
          {/* <QRSavedLinks
            qrCodeValue={qrCodeValue}
            setIsGenerated={setIsGenerated}
            setQrCodeValue={setQrCodeValue}
          /> */}
        </div>
      </div>
    </div>
  );
}

export default QrCodeContainer;

'use client';

import QRCodeGenerator from './qr-code-generator/qr-code-generator';
import QRCodeDownloader from './qr-code-downloader/qr-code-downloader';
import QRCodeClipboard from './qr-code-clipboard/qr-code-clipboard';
import QRCodeExpansion from './qr-code-expansion/qr-code-expansion';
import QRSavedLinks from './qr-code-savelink/qr-code-savelink';

function QRCode({
  qrCodeValue,
  setQrCodeValue,
  qrCodeRef,
  isGenerated,
  setIsGenerated,
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <QRCodeGenerator
          setQrCodeValue={setQrCodeValue}
          qrCodeRef={qrCodeRef}
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

export default QRCode;

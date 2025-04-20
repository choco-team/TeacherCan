import { MutableRefObject } from 'react';
import QRCodeClipboard from './qr-code-clipboard/qr-code-clipboard';
import QRCodeDownloader from './qr-code-downloader/qr-code-downloader';
import QRCodeExpansion from './qr-code-expansion/qr-code-expansion';
import QRCodePrinter from './qr-code-printer/qr-code-printer';
import QrCodeBookmark from './qr-code-bookmark/qr-code-bookmark';
import type { QRCode, SavedQRCodes } from '../qr-code.types';

type Props = {
  qrCodeRef: MutableRefObject<HTMLDivElement>;
  qrCode: QRCode;
  savedQRCodes: SavedQRCodes;
  setSavedQRCodes: (
    value: SavedQRCodes | ((val: SavedQRCodes) => SavedQRCodes),
  ) => void;
};

export default function QrCodeAction({
  qrCode,
  qrCodeRef,
  savedQRCodes,
  setSavedQRCodes,
}: Props) {
  return (
    <div className="flex flex-col gap-y-4">
      <QrCodeBookmark
        qrCode={qrCode}
        savedQRCodes={savedQRCodes}
        setSavedQRCodes={setSavedQRCodes}
      />

      <div className="grid grid-cols-2 gap-2">
        <QRCodeClipboard qrCodeRef={qrCodeRef} qrCode={qrCode} />
        <QRCodeDownloader qrCodeRef={qrCodeRef} qrCode={qrCode} />
        <QRCodePrinter qrCode={qrCode} />
        <QRCodeExpansion qrCode={qrCode} />
      </div>
    </div>
  );
}

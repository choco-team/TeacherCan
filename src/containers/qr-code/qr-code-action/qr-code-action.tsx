import { MutableRefObject } from 'react';
import { QRCode } from '../qr-code.types';
import QRCodeClipboard from './qr-code-clipboard/qr-code-clipboard';
import QRCodeDownloader from './qr-code-downloader/qr-code-downloader';
import QRCodeExpansion from './qr-code-expansion/qr-code-expansion';
import QRCodePrinter from './qr-code-printer/qr-code-printer';

type Props = {
  qrCodeRef: MutableRefObject<HTMLDivElement>;
  qrCode: QRCode;
};

export default function QrCodeAction({ qrCode, qrCodeRef }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 mt-10">
      <QRCodeClipboard qrCodeRef={qrCodeRef} qrCode={qrCode} />
      <QRCodeDownloader qrCodeRef={qrCodeRef} qrCode={qrCode} />
      <QRCodePrinter qrCode={qrCode} />
      <QRCodeExpansion qrCode={qrCode} />
    </div>
  );
}

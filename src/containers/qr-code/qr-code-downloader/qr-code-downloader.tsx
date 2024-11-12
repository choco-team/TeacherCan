'use client';

import { type MutableRefObject } from 'react';
import { DownloadIcon } from 'lucide-react';
import { Button } from '@/components/button';
import type { QRCode } from '../qr-code.type';

type Props = {
  qrCodeRef: MutableRefObject<HTMLDivElement>;
  qrCode: QRCode;
};

function QRCodeDownloader({ qrCodeRef, qrCode }: Props) {
  const downloadQRCode = () => {
    if (!qrCodeRef.current) return;

    if (qrCodeRef.current) {
      const svgElement = qrCodeRef.current.querySelector('svg');
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      const handleImageLoad = () => {
        canvas.width = img.width;
        canvas.height = img.height + 30;
        ctx.drawImage(img, 0, 0);

        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(qrCode.name, canvas.width / 2, img.height + 25);

        const pngFile = canvas.toDataURL('image/png');

        if (pngFile) {
          const link = document.createElement('a');
          link.href = pngFile;
          link.download = 'qrcode.png';
          link.click();
        }
      };

      img.onload = handleImageLoad;
      img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    }
  };

  return (
    <Button
      disabled={!qrCode.value}
      variant="gray-outline"
      className="flex items-center gap-x-1.5"
      onClick={downloadQRCode}
    >
      <DownloadIcon className="size-5" />
      코드 저장
    </Button>
  );
}

export default QRCodeDownloader;

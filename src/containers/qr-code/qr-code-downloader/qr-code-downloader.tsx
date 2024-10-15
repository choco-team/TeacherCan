'use client';

import { Button } from '@/components/button';
import { Download } from 'lucide-react';

function QRCodeDownloader({ qrCodeRef, qrCodeName }) {
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
        ctx.fillText(qrCodeName, canvas.width / 2, img.height + 25);

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
    <div>
      <Button
        onClick={downloadQRCode}
        variant="gray-ghost"
        className="size:icon"
      >
        <Download width={30} height={30} />
      </Button>
    </div>
  );
}

export default QRCodeDownloader;

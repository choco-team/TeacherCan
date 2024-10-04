'use client';

import { Button } from '@/components/button';
import { Download } from 'lucide-react';

function QRCodeDownloader() {
  const downloadQRCode = () => {
    const svg = document.querySelector('svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      const handleImageLoad = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
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
    <div className="flex justify-center mt-4">
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

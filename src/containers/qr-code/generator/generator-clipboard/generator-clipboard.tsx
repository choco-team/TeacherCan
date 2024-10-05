'use client';

import { Button } from '@/components/button';
import { ClipboardCopy } from 'lucide-react';

function QRCodeClipboard({ qrCodeRef }) {
  const copyQRCodeToClipboard = async () => {
    if (!qrCodeRef) return;

    try {
      const svgElement = qrCodeRef.querySelector('svg');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const svgData = new XMLSerializer().serializeToString(svgElement);

      const img = new Image();
      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(async (blob) => {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
        });
      };
      img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    } catch (err) {
      console.error('Failed to copy image: ', err);
    }
  };

  return (
    <div>
      <Button
        onClick={copyQRCodeToClipboard}
        variant="gray-ghost"
        className="size:icon"
      >
        <ClipboardCopy width={30} height={30} />
      </Button>
    </div>
  );
}

export default QRCodeClipboard;

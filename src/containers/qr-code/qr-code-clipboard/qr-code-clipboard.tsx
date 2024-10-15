'use client';

import { Button } from '@/components/button';
import { ClipboardCopy } from 'lucide-react';

function QRCodeClipboard({ qrCodeRef, qrCodeName }) {
  const copyQRCodeToClipboard = async () => {
    if (!qrCodeRef.current) return;

    try {
      const svgElement = qrCodeRef.current.querySelector('svg');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const svgData = new XMLSerializer().serializeToString(svgElement);

      const img = new Image();
      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height + 30;
        ctx.drawImage(img, 0, 0);
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.fillText(qrCodeName, canvas.width / 2, img.height + 25);
        canvas.toBlob(async (blob) => {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
        });
      };
      img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    } catch (err) {
      console.error('이미지를 복사하는 데 실패했습니다: ', err);
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

'use client';

import { type MutableRefObject } from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { DownloadIcon } from 'lucide-react';
import { Button } from '@/components/button';
import type { QRCode } from '../qr-code.type';

type Props = {
  qrCodeRef: MutableRefObject<HTMLDivElement>;
  qrCode: QRCode;
};

function QRCodeDownloader({ qrCodeRef, qrCode }: Props) {
  const handleDownload = async () => {
    const target = qrCodeRef.current;
    if (!target) return;

    try {
      const canvas = await html2canvas(target);
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${qrCode.name || 'qr-code'}.png`);
        }
      });
    } catch (error) {
      console.error('이미지 다운로드 실패:', error);
    }
  };

  return (
    <Button
      disabled={!qrCode.value}
      variant="gray-outline"
      className="flex items-center gap-x-1.5"
      onClick={handleDownload}
    >
      <DownloadIcon className="size-5" />
      코드 저장
    </Button>
  );
}

export default QRCodeDownloader;

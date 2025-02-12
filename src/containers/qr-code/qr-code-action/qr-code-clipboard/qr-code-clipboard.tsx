'use client';

import { type MutableRefObject } from 'react';
import html2canvas from 'html2canvas';
import { ClipboardIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/button';
import type { QRCode } from '../../qr-code.types';

type Props = {
  qrCodeRef: MutableRefObject<HTMLDivElement>;
  qrCode: QRCode;
};

function QRCodeClipboard({ qrCodeRef, qrCode }: Props) {
  const { toast } = useToast();

  const handleCopy = async () => {
    const target = qrCodeRef.current;
    if (!target) return;

    const canvas = await html2canvas(target);
    canvas.toBlob(async (blob) => {
      try {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);
          toast({ title: '클립보드에 복사했어요.', variant: 'success' });
        }
      } catch (error) {
        console.error('클립보드 복사 실패:', error);
        toast({ title: '복사에 실패했어요.', variant: 'error' });
      }
    });
  };

  return (
    <Button
      disabled={!qrCode.value}
      variant="gray-outline"
      className="flex items-center gap-x-1.5"
      onClick={handleCopy}
    >
      <ClipboardIcon className="size-5" />
      코드 복사
    </Button>
  );
}

export default QRCodeClipboard;

'use client';

import { ZoomInIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog';
import { cn } from '@/styles/utils';
import type { QRCode } from '../qr-code.type';

type Props = {
  qrCode: QRCode;
};

function QRCodeExpansion({ qrCode }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={!qrCode.value}
          variant="primary-outline"
          className="flex items-center gap-x-1.5"
        >
          <ZoomInIcon className="size-5" />
          크게 보기
        </Button>
      </DialogTrigger>

      <DialogContent
        fullScreen
        className={cn(
          'p-12 flex flex-col items-center justify-center gap-y-8',
          'md:p-16 md:gap-y-12',
          'lg:p-24',
        )}
        aria-describedby={undefined}
      >
        {qrCode.value && (
          <QRCodeSVG
            value={qrCode.value}
            title={qrCode.name}
            className="min-w-60 min-h-60 size-full"
          />
        )}
        <DialogTitle>
          {qrCode.name && (
            <span
              className={cn('text-3xl font-bold', 'md:text-4xl', 'lg:text-5xl')}
            >
              {qrCode.name}
            </span>
          )}
        </DialogTitle>
      </DialogContent>
    </Dialog>
  );
}

export default QRCodeExpansion;

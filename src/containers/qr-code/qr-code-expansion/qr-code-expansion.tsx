'use client';

import { ZoomIn } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog';
import { cn } from '@/styles/utils';

function QRCodeExpansion({ qrCodeValue, qrCodeName }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="gray-ghost">
          <ZoomIn width={30} height={30} />
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
        {qrCodeValue && (
          <QRCodeSVG
            value={qrCodeValue}
            className="min-w-60 min-h-60 size-full"
          />
        )}
        <DialogTitle>
          {qrCodeName && (
            <span
              className={cn('text-3xl font-bold', 'md:text-4xl', 'lg:text-5xl')}
            >
              {qrCodeName}
            </span>
          )}
        </DialogTitle>
      </DialogContent>
    </Dialog>
  );
}

export default QRCodeExpansion;

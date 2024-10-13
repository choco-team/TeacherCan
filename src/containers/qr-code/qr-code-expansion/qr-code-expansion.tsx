'use client';

import { ZoomIn } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/dialog';

function QRCodeExpansion({ qrCodeValue }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="gray-ghost">
          <ZoomIn width={30} height={30} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex justify-center">
          {qrCodeValue && (
            <QRCodeSVG value={qrCodeValue} width={300} height={300} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default QRCodeExpansion;

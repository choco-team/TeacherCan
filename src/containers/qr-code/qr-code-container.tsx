'use client';

import { useRef, useState, useTransition } from 'react';
import { cn } from '@/styles/utils';
import type { QRCode } from './qr-code.types';
import QrCodeAction from './qr-code-action/qr-code-action';
import QrCodePreview from './qr-code-preview/qr-code-preview';
import QrCodeEditor from './qr-code-editor/qr-code-editor';

function QrCodeContainer() {
  const [qrCode, setQrCode] = useState<QRCode>({ value: '', name: '' });
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const [isPending, startTransition] = useTransition();

  return (
    <div
      className={cn(
        'flex-grow flex flex-col gap-12 mx-auto w-full max-w-screen-md',
        'lg:flex-row',
      )}
    >
      <QrCodeEditor
        qrCode={qrCode}
        setQrCode={setQrCode}
        startTransition={startTransition}
      />
      <div className="flex-1 flex flex-col gap-y-10">
        <QrCodePreview isPending={isPending} ref={qrCodeRef} qrCode={qrCode} />
        <QrCodeAction qrCode={qrCode} qrCodeRef={qrCodeRef} />
      </div>
    </div>
  );
}

export default QrCodeContainer;

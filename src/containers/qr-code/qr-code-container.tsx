'use client';

import { useRef, useState, useTransition } from 'react';
import type { QRCode } from './qr-code.types';
import QrCodeAction from './qr-code-action/qr-code-action';
import QrCodePreview from './qr-code-preview/qr-code-preview';
import QrCodeEditor from './qr-code-editor/qr-code-editor';

function QrCodeContainer() {
  const [qrCode, setQrCode] = useState<QRCode>({ value: '', name: '' });
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-12 max-w-[900px] mx-auto items-start lg:flex-row">
      <QrCodeEditor
        qrCode={qrCode}
        setQrCode={setQrCode}
        startTransition={startTransition}
      />
      <div className="flex-1 w-full">
        <QrCodePreview isPending={isPending} ref={qrCodeRef} qrCode={qrCode} />
        <QrCodeAction qrCode={qrCode} qrCodeRef={qrCodeRef} />
      </div>
    </div>
  );
}

export default QrCodeContainer;

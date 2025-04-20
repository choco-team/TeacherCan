'use client';

import { useRef, useState, useTransition } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { cn } from '@/styles/utils';
import QrCodeAction from './qr-code-action/qr-code-action';
import QrCodePreview from './qr-code-preview/qr-code-preview';
import QrCodeEditor from './qr-code-editor/qr-code-editor';
import { QR_CODE_LOCAL_STORAGE_KEY } from './qr-code.constants';
import type { QRCode, SavedQRCodes } from './qr-code.types';

function QrCodeContainer() {
  const [qrCode, setQrCode] = useState<QRCode>({ value: '', name: '' });
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const [savedQRCodes, setSavedQRCodes] = useLocalStorage<SavedQRCodes>(
    QR_CODE_LOCAL_STORAGE_KEY,
    [],
  );

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
        savedQRCodes={savedQRCodes}
        startTransition={startTransition}
        setQrCode={setQrCode}
        setSavedQRCodes={setSavedQRCodes}
      />
      <div className="flex-1 flex flex-col gap-y-6">
        <QrCodePreview isPending={isPending} ref={qrCodeRef} qrCode={qrCode} />
        <QrCodeAction
          qrCode={qrCode}
          qrCodeRef={qrCodeRef}
          savedQRCodes={savedQRCodes}
          setSavedQRCodes={setSavedQRCodes}
        />
      </div>
    </div>
  );
}

export default QrCodeContainer;

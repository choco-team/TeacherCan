'use client';

import { useState } from 'react';
import QRCode from './generator';

function QrCodeContainer() {
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [qrCodeRef, setQrCodeRef] = useState(null);
  const [isGenerated, setIsGenerated] = useState(false);
  return (
    <QRCode
      setQrCodeValue={setQrCodeValue}
      qrCodeValue={qrCodeValue}
      setQrCodeRef={setQrCodeRef}
      qrCodeRef={qrCodeRef}
      isGenerated={isGenerated}
      setIsGenerated={setIsGenerated}
    />
  );
}

export default QrCodeContainer;

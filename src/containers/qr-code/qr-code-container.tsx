'use client';

import { useRef, useState } from 'react';
import QRCode from './generator';

function QrCodeContainer() {
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const qrCodeRef = useRef(null);
  return (
    <QRCode
      setQrCodeValue={setQrCodeValue}
      qrCodeValue={qrCodeValue}
      qrCodeRef={qrCodeRef}
      isGenerated={isGenerated}
      setIsGenerated={setIsGenerated}
    />
  );
}

export default QrCodeContainer;

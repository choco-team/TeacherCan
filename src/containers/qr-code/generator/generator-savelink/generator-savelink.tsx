import { useState, useEffect } from 'react';

function QRSavedLinks({ qrCodeValue }: { qrCodeValue: string }): JSX.Element {
  const [savedLinks, setSavedLinks] = useState<string[]>([]);

  const saveLink = (newLink: string) => {
    if (!savedLinks.includes(newLink)) {
      setSavedLinks([...savedLinks, newLink]);
      localStorage.setItem(
        'qr_codes',
        JSON.stringify([...savedLinks, newLink]),
      );
    }
  };

  useEffect(() => {
    const storedLinks = localStorage.getItem('qr_codes');
    if (storedLinks) {
      setSavedLinks(JSON.parse(storedLinks));
    }
  }, []);

  useEffect(() => {
    saveLink(qrCodeValue);
  }, [qrCodeValue]);

  return (
    <div>
      <h2>저장된 QR 코드 링크</h2>
      <ul>
        {savedLinks.map((link) => (
          <li key={link}>{link}</li>
        ))}
      </ul>
    </div>
  );
}

export default QRSavedLinks;

import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  TransitionStartFunction,
  useState,
} from 'react';
import { Heading1 } from '@/components/heading';
import { QRCode, SavedQRCodes } from '../qr-code.types';
import QrCodeBookmarks from './qr-code-bookmarks/qr-code-bookmarks';
import QrCodeForm from './qr-code-form/qr-code-form';

type Props = {
  qrCode: QRCode;
  savedQRCodes: SavedQRCodes;
  startTransition: TransitionStartFunction;
  setQrCode: Dispatch<SetStateAction<QRCode>>;
  setSavedQRCodes: (
    value: SavedQRCodes | ((val: SavedQRCodes) => SavedQRCodes),
  ) => void;
};

export default function QrCodeEditor({
  qrCode,
  savedQRCodes,
  startTransition,
  setQrCode,
  setSavedQRCodes,
}: Props) {
  const [qrCodeInputValue, setQrCodeInputValue] = useState('');

  const handleGenerate = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setQrCodeInputValue(value);
    startTransition(() => setQrCode((prev) => ({ ...prev, value })));
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setQrCode((prev) => ({ ...prev, name: event.target.value }));
  };

  const handleDeleteQRCode = (id: string) => {
    setSavedQRCodes((prev) =>
      prev.filter((entry: { id: string }) => entry.id !== id),
    );
  };

  return (
    <div className="flex-auto flex flex-col gap-y-10">
      <Heading1>QR코드 만들기</Heading1>

      <QrCodeForm
        qrCode={qrCode}
        qrCodeInputValue={qrCodeInputValue}
        handleGenerate={handleGenerate}
        handleChangeName={handleChangeName}
      />

      <QrCodeBookmarks
        savedQRCodes={savedQRCodes}
        setQrCode={setQrCode}
        setQrCodeInputValue={setQrCodeInputValue}
        handleDeleteQRCode={handleDeleteQRCode}
      />
    </div>
  );
}

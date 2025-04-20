import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  TransitionStartFunction,
  useState,
} from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { nanoid } from 'nanoid';
import { Heading1 } from '@/components/heading';
import { QRCode, SavedQRCodes } from '../qr-code.types';
import QrCodeBookmarks from './qr-code-bookmarks/qr-code-bookmarks';
import QrCodeForm from './qr-code-form/qr-code-form';

type Props = {
  qrCode: QRCode;
  startTransition: TransitionStartFunction;
  setQrCode: Dispatch<SetStateAction<QRCode>>;
};

export default function QrCodeEditor({
  qrCode,
  startTransition,
  setQrCode,
}: Props) {
  const { toast } = useToast();

  const [qrCodeInputValue, setQrCodeInputValue] = useState('');

  const [savedQRCodes, setSavedQRCodes] = useLocalStorage<SavedQRCodes>(
    'qrcodes',
    [],
  );

  const handleGenerate = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setQrCodeInputValue(value);
    startTransition(() => setQrCode((prev) => ({ ...prev, value })));
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setQrCode((prev) => ({ ...prev, name: event.target.value }));
  };

  const handleSaveToLocalStorage = () => {
    const currentDate = new Date().toISOString();
    const newEntry = {
      id: nanoid(),
      date: currentDate,
      url: qrCode.value,
      title: qrCode.name,
    };

    if (savedQRCodes.length >= 10) {
      toast({
        title: '최대 10개까지 저장할 수 있어요.',
        variant: 'error',
      });
      return;
    }

    const updatedData = [...savedQRCodes, newEntry];

    setSavedQRCodes(updatedData);
  };

  const handleDeleteQRCode = (id: string) => {
    const updatedData = savedQRCodes.filter(
      (entry: { id: string }) => entry.id !== id,
    );

    setSavedQRCodes(updatedData);
  };

  const isButtonDisabled = !qrCode.value || !qrCode.name;

  return (
    <div className="flex-1 flex flex-col gap-y-10">
      <Heading1>QR코드 만들기</Heading1>

      <QrCodeForm
        qrCode={qrCode}
        qrCodeInputValue={qrCodeInputValue}
        handleGenerate={handleGenerate}
        handleChangeName={handleChangeName}
        handleSaveToLocalStorage={handleSaveToLocalStorage}
        isButtonDisabled={isButtonDisabled}
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

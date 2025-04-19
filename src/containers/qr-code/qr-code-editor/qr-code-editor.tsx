import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  TransitionStartFunction,
  useState,
} from 'react';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Button } from '@/components/button';
import { Heading4 } from '@/components/heading';
import { Badge } from '@/components/badge';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { nanoid } from 'nanoid';
import { QRCode, SavedQRCodes } from '../qr-code.types';
import SavedQrCodeDescription from '../saved-qr-code-description/saved-qr-code-description';

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
        title: '최대 10개의 QR코드만 저장할 수 있습니다.',
        variant: 'error',
      });
      return;
    }

    const updatedData = [...savedQRCodes, newEntry];

    setSavedQRCodes(updatedData);
    toast({ title: 'QR코드가 저장되었습니다.', variant: 'success' });
  };

  const handleDeleteQRCode = (id: string) => {
    const updatedData = savedQRCodes.filter(
      (entry: { id: string }) => entry.id !== id,
    );

    setSavedQRCodes(updatedData);
    toast({ title: 'QR코드가 삭제되었습니다.', variant: 'success' });
  };

  const isButtonDisabled = !qrCode.value || !qrCode.name;
  const hasSavedQRCodes = savedQRCodes && savedQRCodes.length > 0;

  return (
    <div className="flex flex-col gap-y-4 w-full lg:w-[400px]">
      <Heading4 className="font-semibold text-lg">
        QR코드 기본정보 입력
      </Heading4>
      <Label className="space-y-1.5">
        <span className="font-semibold">
          URL 링크 <span className="text-red">*</span>
        </span>
        <Input
          name="value"
          value={qrCodeInputValue}
          required
          onChange={handleGenerate}
          placeholder="https://www.teachercan.com"
        />
      </Label>
      <Label className="space-y-1.5">
        <span className="font-semibold">제목</span>
        <div className="flex items-center space-x-4">
          <Input
            name="name"
            value={qrCode.name}
            placeholder="티처캔"
            maxLength={12}
            onChange={handleChangeName}
            className="flex-1"
          />
          <Button
            onClick={handleSaveToLocalStorage}
            disabled={isButtonDisabled}
          >
            QR코드 북마크
          </Button>
        </div>
      </Label>

      <div className="w-full h-[1px] bg-gray-200 my-4" />

      <div className="w-full max-w-96">
        <Heading4 className="font-semibold text-lg mb-4">
          북마크된 QR코드 목록
        </Heading4>
        <div className="flex flex-wrap gap-2">
          <SavedQrCodeDescription
            hasSavedQRCodes={hasSavedQRCodes}
            savedQRCodes={savedQRCodes}
          />
          <ul className="flex flex-wrap gap-2">
            {hasSavedQRCodes &&
              savedQRCodes.map((entry) => (
                <Badge
                  key={entry.id}
                  variant="primary"
                  size="sm"
                  className="cursor-pointer flex items-center space-x-2 relative"
                  onClick={() => {
                    setQrCode({ value: entry.url, name: entry.title });
                    setQrCodeInputValue(entry.url);
                  }}
                >
                  {entry.title}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteQRCode(entry.id);
                    }}
                    className="ml-2 text-red-300 hover:text-red-700 text-xs"
                  >
                    ✕
                  </button>
                </Badge>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

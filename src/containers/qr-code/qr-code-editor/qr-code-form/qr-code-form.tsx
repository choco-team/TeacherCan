import { type ChangeEvent } from 'react';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Button } from '@/components/button';
import { QRCode } from '../../qr-code.types';

type Props = {
  qrCode: QRCode;
  qrCodeInputValue: string;
  handleGenerate: (event: ChangeEvent<HTMLInputElement>) => void;
  handleChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSaveToLocalStorage: () => void;
  isButtonDisabled: boolean;
};

export default function QrCodeForm({
  qrCode,
  qrCodeInputValue,
  handleGenerate,
  handleChangeName,
  handleSaveToLocalStorage,
  isButtonDisabled,
}: Props) {
  return (
    <section className="flex flex-col gap-y-6">
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
    </section>
  );
}

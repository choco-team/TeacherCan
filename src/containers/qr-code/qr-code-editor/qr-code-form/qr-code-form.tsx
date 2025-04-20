import { type ChangeEvent } from 'react';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Label } from '@/components/label';
import type { QRCode } from '../../qr-code.types';

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
      <div className="space-y-2">
        <Label required>URL 링크</Label>
        <Input
          name="value"
          value={qrCodeInputValue}
          required
          onChange={handleGenerate}
          placeholder="https://www.teachercan.com"
        />
      </div>

      <div className="space-y-2">
        <Label>제목</Label>
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
      </div>
    </section>
  );
}

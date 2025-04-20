import { type ChangeEvent } from 'react';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import type { QRCode } from '../../qr-code.types';

type Props = {
  qrCode: QRCode;
  qrCodeInputValue: string;
  handleGenerate: (event: ChangeEvent<HTMLInputElement>) => void;
  handleChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function QrCodeForm({
  qrCode,
  qrCodeInputValue,
  handleGenerate,
  handleChangeName,
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
        <Input
          name="name"
          value={qrCode.name}
          placeholder="티처캔"
          maxLength={12}
          onChange={handleChangeName}
        />
      </div>
    </section>
  );
}

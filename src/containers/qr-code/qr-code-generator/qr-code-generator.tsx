import { type ChangeEvent, useState, useTransition } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { cn } from '@/styles/utils';
import TeacherCanLogo from '@/assets/images/logo/teacher-can.svg';

function QRCodeGenerator({
  setQrCodeValue,
  qrCodeRef,
  qrCodeValue,
  qrCodeName,
  setQrCodeName,
}) {
  const [qrCodeInputValue, setQrCodeInputValue] = useState('');

  const [isPending, startTransition] = useTransition();

  const handleGenerate = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setQrCodeInputValue(value);
    startTransition(() => setQrCodeValue(value));
  };

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setQrCodeName(e.target.value);
  };

  return (
    <section className="flex flex-col items-center gap-y-10 w-full">
      <div className="flex flex-col gap-y-4 w-full max-w-96">
        <Label className="space-y-1">
          <span className="font-semibold">
            URL 링크 <span className="text-red">*</span>
          </span>
          <Input
            value={qrCodeInputValue}
            required
            onChange={handleGenerate}
            placeholder="https://www.teachercan.com"
          />
        </Label>

        <Label className="space-y-1">
          <span className="font-semibold">제목</span>
          <Input
            value={qrCodeName}
            placeholder="티처캔"
            maxLength={12}
            onChange={handleChangeName}
          />
        </Label>
      </div>

      <div className="min-h-72">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div ref={qrCodeRef} className="space-y-5 bg-white p-5">
            {qrCodeValue ? (
              <QRCodeCanvas
                value={qrCodeValue}
                title={qrCodeName}
                size={200}
                className={cn(isPending && 'opacity-70')}
              />
            ) : (
              <TeacherCanLogo width={200} height={200} />
            )}

            {qrCodeName && (
              <p className="text-center text-lg text-black font-semibold">
                {qrCodeName}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default QRCodeGenerator;

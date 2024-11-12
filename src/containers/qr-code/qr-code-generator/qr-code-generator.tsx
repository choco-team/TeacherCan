import {
  type ChangeEvent,
  type Dispatch,
  type ForwardedRef,
  forwardRef,
  type SetStateAction,
  useState,
  useTransition,
} from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { cn } from '@/styles/utils';
import TeacherCanLogo from '@/assets/images/logo/teacher-can.svg';
import type { QRCode } from '../qr-code.type';

type Props = {
  qrCode: QRCode;
  setQrCode: Dispatch<SetStateAction<QRCode>>;
};

function QRCodeGenerator(
  { qrCode, setQrCode }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const [qrCodeInputValue, setQrCodeInputValue] = useState('');

  const [isPending, startTransition] = useTransition();

  const handleGenerate = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setQrCodeInputValue(value);
    startTransition(() => setQrCode((prev) => ({ ...prev, value })));
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setQrCode((prev) => ({ ...prev, name: event.target.value }));
  };

  return (
    <section className="flex flex-col items-center gap-y-10 w-full">
      <div className="flex flex-col gap-y-4 w-full max-w-96">
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

        <Label className="space-y-1">
          <span className="font-semibold">제목</span>
          <Input
            name="name"
            value={qrCode.name}
            placeholder="티처캔"
            maxLength={12}
            onChange={handleChangeName}
          />
        </Label>
      </div>

      <div className="min-h-72">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div ref={ref} className="space-y-5 bg-white p-5">
            {qrCode.value ? (
              <QRCodeCanvas
                value={qrCode.value}
                title={qrCode.name}
                size={200}
                className={cn(isPending && 'opacity-70')}
              />
            ) : (
              <TeacherCanLogo width={200} height={200} />
            )}

            {qrCode.name && (
              <p className="text-center text-lg text-black font-semibold">
                {qrCode.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default forwardRef(QRCodeGenerator);

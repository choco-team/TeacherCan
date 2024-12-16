import {
  type ChangeEvent,
  type Dispatch,
  type ForwardedRef,
  forwardRef,
  type SetStateAction,
  useState,
  useTransition,
  useEffect,
} from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { cn } from '@/styles/utils';
import TeacherCanLogo from '@/assets/images/logo/teacher-can.svg';
import { Button } from '@/components/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/badge';
import { Heading4 } from '@/components/heading';
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

  const [savedQRCodes, setSavedQRCodes] = useState<
    { date: string; url: string; title: string }[]
  >([]);

  const { toast } = useToast();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('qrcodes') || '[]');
    setSavedQRCodes(storedData);
  }, []);

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
      date: currentDate,
      url: qrCode.value,
      title: qrCode.name,
    };

    const existingData = JSON.parse(localStorage.getItem('qrcodes') || '[]');

    const isLinkDuplicate = existingData.some(
      (entry: { url: string; title: string }) =>
        entry.url === qrCode.value || entry.title === qrCode.name,
    );

    if (isLinkDuplicate) {
      toast({ title: '이미 저장된 QR코드 또는 제목입니다.', variant: 'error' });
      return;
    }

    if (existingData.length >= 10) {
      toast({
        title: '최대 10개의 QR코드만 저장할 수 있습니다.',
        variant: 'error',
      });
      return;
    }

    const updatedData = [...existingData, newEntry];

    localStorage.setItem('qrcodes', JSON.stringify(updatedData));
    setSavedQRCodes(updatedData);
    toast({ title: 'QR코드가 저장되었습니다.', variant: 'success' });
  };

  const handleDeleteQRCode = (url: string) => {
    const existingData = JSON.parse(localStorage.getItem('qrcodes') || '[]');

    const updatedData = existingData.filter(
      (entry: { url: string }) => entry.url !== url,
    );

    localStorage.setItem('qrcodes', JSON.stringify(updatedData));
    setSavedQRCodes(updatedData);
    toast({ title: 'QR코드가 삭제되었습니다.', variant: 'success' });
  };

  const isButtonDisabled = !qrCode.value || !qrCode.name;

  return (
    <section className="flex flex-col items-center gap-y-10 w-full">
      <div className="flex flex-col gap-y-4 w-full max-w-96 mt-8">
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
          <div className="flex items-center space-x-4">
            <Input
              name="name"
              value={qrCode.name}
              placeholder="티처캔"
              maxLength={12}
              onChange={handleChangeName}
              className="flex-1" // Input이 공간을 차지하도록 설정
            />
            <Button
              onClick={handleSaveToLocalStorage}
              disabled={isButtonDisabled}
            >
              QR코드 북마크
            </Button>
          </div>
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
      <div className="w-full max-w-96">
        <Heading4 className="font-semibold text-lg mb-4">
          북마크된 QR 코드 목록
        </Heading4>
        <div className="flex flex-wrap gap-2">
          {savedQRCodes.map((entry) => (
            <Badge
              key={entry.url}
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
                  handleDeleteQRCode(entry.url);
                }}
                className="ml-2 text-red-300 hover:text-red-700 text-xs"
              >
                ✕
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}

export default forwardRef(QRCodeGenerator);

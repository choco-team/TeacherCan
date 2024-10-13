import { useRef, useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import TeacherCanLogo from '@/assets/images/logo/teacher-can.svg';
import { Heading2 } from '@/components/heading';
import { Input } from '@/components/input';
import { Button } from '@/components/button';

function QRCodeGenerator({
  setQrCodeValue,
  setQrCodeRef,
  qrCodeValue,
  isGenerated,
  setIsGenerated,
}) {
  const qrRef = useRef(null);
  const [newQrCodeValue, setNewQRCodeValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewQRCodeValue(e.target.value);
    setIsGenerated(false);
  };

  const handleGenerate = () => {
    setQrCodeValue(newQrCodeValue);
    setIsGenerated(true);
  };

  useEffect(() => {
    if (qrRef.current) {
      setQrCodeRef(qrRef.current);
    }
  }, [isGenerated]);

  return (
    <div>
      <Heading2 className="text-center text-2xl font-semibold mb-4">
        QR 코드 생성
      </Heading2>
      <div className="flex justify-center">
        <Input
          type="text"
          value={newQrCodeValue}
          onChange={handleChange}
          placeholder="주소를 입력하세요"
          className="flex-grow mr-4"
        />
        <Button onClick={handleGenerate} className="w-1/4">
          QR 코드 생성
        </Button>
      </div>
      {isGenerated && (
        <div className="flex justify-center">
          <div ref={qrRef}>
            <QRCodeSVG
              value={qrCodeValue}
              width={200}
              height={200}
              className="mt-8"
            />
          </div>
        </div>
      )}
      {!isGenerated && (
        <div className="flex justify-center">
          <TeacherCanLogo
            width="200"
            height="200"
            className="animate-bounce-in-top mt-8"
          />
        </div>
      )}
    </div>
  );
}

export default QRCodeGenerator;

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import TeacherCanLogo from '@/assets/images/logo/teacher-can.svg';
import { Heading2 } from '@/components/heading';
import { Input } from '@/components/input';
import { Button } from '@/components/button';

function QRCodeGenerator({
  setQrCodeValue,
  qrCodeRef,
  qrCodeValue,
  qrCodeName,
  setQrCodeName,
  isGenerated,
  setIsGenerated,
}) {
  const [newQrCodeValue, setNewQRCodeValue] = useState('');
  // const [newQRCodeName, setNewQRCodeName] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewQRCodeValue(e.target.value);
    setIsGenerated(false);
  };

  const handleQRLinkFocus = () => {
    setNewQRCodeValue('');
  };

  const handleGenerate = () => {
    setQrCodeValue(newQrCodeValue);
    setIsGenerated(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQrCodeName(e.target.value);
  };

  const handleQRNameFocus = () => {
    setQrCodeName('');
  };

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
          onFocus={handleQRLinkFocus}
          placeholder="주소를 입력하세요"
          className="flex-grow mr-4 w-3/4"
        />
        <Button onClick={handleGenerate} className="w-1/4">
          QR 코드 생성
        </Button>
      </div>
      <div className="flex justify-center mt-4">
        <Input
          type="text"
          value={qrCodeName}
          onChange={handleNameChange}
          onFocus={handleQRNameFocus}
          placeholder="QR 코드 이름을 입력하세요"
          className="flex-grow w-3/4"
        />
      </div>
      {isGenerated && (
        <div className="flex justify-center">
          <div ref={qrCodeRef}>
            <QRCodeSVG
              value={qrCodeValue}
              width={200}
              height={200}
              className="mt-8"
              fgColor="green"
            />
            {qrCodeName && (
              <p className="text-center mt-2 text-lg font-semibold w-full">
                {qrCodeName}
              </p>
            )}
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

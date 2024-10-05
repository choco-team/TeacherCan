'use client';

import { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import TeacherCanLogo from '@/assets/images/logo/teacher-can.svg';
import { Heading2 } from '@/components/heading';
import { Input } from '@/components/input';

function DynamicQRCodeGenerator({ setQrCodeValue, setQrCodeRef }) {
  const [inputValue, setInputValue] = useState('');
  const qrRef = useRef(null);

  const handleChange = (e) => {
    setInputValue(e.target.value);
    setQrCodeValue(e.target.value);
  };

  useEffect(() => {
    if (qrRef.current) {
      setQrCodeRef(qrRef.current);
    }
  }, [inputValue]);

  return (
    <div>
      <Heading2 className="text-center text-2xl font-semibold mb-4">
        QR Code 생성
      </Heading2>
      <Input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="주소를 입력하세요"
        className="p-2 border border-gray-300 rounded-lg mb-8"
      />
      {inputValue ? (
        <div className="flex justify-center">
          <div ref={qrRef}>
            <QRCodeSVG value={inputValue} width={200} height={200} />
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <TeacherCanLogo
            width="200"
            height="200"
            className="animate-bounce-in-top"
          />
        </div>
      )}
    </div>
  );
}

export default DynamicQRCodeGenerator;

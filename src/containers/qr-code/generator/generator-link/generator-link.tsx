'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import TeacherCanLogo from '@/assets/images/logo/teacher-can.svg';
import { Heading2 } from '@/components/heading';
import { Input } from '@/components/input';
import QRCodeDownloader from '../generator-download/generator-downloader';

function DynamicQRCodeGenerator() {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
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
            <QRCodeSVG value={inputValue} width={200} height={200} />
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
        <div className="mt-8">
          <QRCodeDownloader />
        </div>
      </div>
    </div>
  );
}

export default DynamicQRCodeGenerator;

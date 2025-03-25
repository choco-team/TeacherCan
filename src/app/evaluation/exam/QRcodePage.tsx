'use client';

import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/button';

export default function QRCodePage() {
  const [testUrl, setTestUrl] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // URL에서 쿼리 파라미터 가져오기
    const params = new URLSearchParams(window.location.search);
    const url = params.get('url');
    if (url) {
      setTestUrl(url);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="mb-6 text-center" />

        <div className="flex flex-col items-center justify-center mb-8">
          {isClient && testUrl && (
            <QRCodeSVG value={testUrl} size={280} level="H" />
          )}
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">
            아래 URL을 통해 시험에 접속하세요:
          </p>
          <div className="flex">
            <input
              type="text"
              value={testUrl}
              readOnly
              className="flex-1 p-2 border rounded-l text-sm bg-gray-50"
            />
            <Button
              onClick={() => {
                if (isClient) {
                  navigator.clipboard.writeText(testUrl);
                  alert('URL이 클립보드에 복사되었습니다!');
                }
              }}
            >
              복사
            </Button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>
            이 QR 코드를 스캔하여 모바일 기기에서도 시험에 접속할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

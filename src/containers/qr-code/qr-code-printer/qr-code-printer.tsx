'use client';

import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/button';
import { PrinterCheck } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/dialog';
import { Input } from '@/components/input';
import { Label } from '@/components/label';

function QRCodePrinter({ qrCodeValue, qrCodeName, qrCodeRef }) {
  const [gridSize, setGridSize] = useState(12);

  const gridConfigs = {
    1: { columns: 1, rows: 1 },
    12: { columns: 3, rows: 4 },
    30: { columns: 5, rows: 6 },
  };

  const printQRCode = () => {
    if (!qrCodeRef.current) return;
    const svgElement = qrCodeRef.current.querySelector('svg');
    if (!svgElement) {
      console.error('출력할 이미지를 찾을 수 없습니다.');
      return;
    }
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const imgSrc = `data:image/svg+xml;base64,${btoa(svgData)}`;
    const { columns, rows } = gridConfigs[gridSize];
    const printHTML = `
      <html>
        <head>
          <style>
            body { text-align: center; margin: 0; padding: 20px; }
            .grid-container { display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 20px; width: 80%; margin: auto; }
            img { width: 100%; height: auto; }
            .qr-name { margin-top: 5px; font-size: 12px; text-align: center; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="grid-container">
            ${Array(columns * rows)
              .fill(
                `<div>
                  <img src="${imgSrc}" alt="QR Code" />
                  <div class="qr-name">${qrCodeName}</div>
                </div>`,
              )
              .join('')}
          </div>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.open();
    printWindow.document.write(printHTML);
    printWindow.document.close();
  };

  return (
    <div>
      <div style={{ display: 'none' }} ref={qrCodeRef}>
        <QRCodeCanvas value={qrCodeValue} size={256} />
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="gray-ghost" className="size:icon">
            <PrinterCheck width={30} height={30} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>프린트 설정</DialogTitle>
            <DialogDescription>QR 코드 개수를 선택하세요.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Label className="m-6">
              <Input
                type="radio"
                name="gridSize"
                value="1"
                checked={gridSize === 1}
                onChange={() => setGridSize(1)}
              />
              <span className="text-lg m-1">1x1</span>
            </Label>
            <Label className="m-6">
              <Input
                type="radio"
                name="gridSize"
                value="12"
                checked={gridSize === 12}
                onChange={() => setGridSize(12)}
              />
              <span className="text-lg m-1">4x3</span>
            </Label>
            <Label className="m-6">
              <Input
                type="radio"
                name="gridSize"
                value="30"
                checked={gridSize === 30}
                onChange={() => setGridSize(30)}
              />
              <span className="text-lg m-1">6x5</span>
            </Label>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                onClick={printQRCode}
                variant="gray-ghost"
                className="size:icon"
              >
                확인
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default QRCodePrinter;

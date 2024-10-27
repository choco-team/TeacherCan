import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/button';
import { PrinterCheck } from 'lucide-react';
import { useState } from 'react';

function QRCodePrinter({ qrCodeValue, qrCodeName, qrCodeRef }) {
  const [gridSize, setGridSize] = useState(12); // 기본값은 12개

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
        <body>
          <h2>${qrCodeName || 'QR Codes'}</h2>
          <div class="grid-container">
            ${Array(columns * rows)
              .fill(
                `
              <div>
                <img src="${imgSrc}" alt="QR Code" />
                <div class="qr-name">${qrCodeName}</div>
              </div>
            `,
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
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  return (
    <div>
      <Button onClick={printQRCode} variant="gray-ghost" className="size:icon">
        <PrinterCheck width={30} height={30} />
      </Button>
      <div>
        <label>
          <input
            type="radio"
            name="gridSize"
            value="1"
            checked={gridSize === 1}
            onChange={() => setGridSize(1)}
          />{' '}
          1개
        </label>
        <label>
          <input
            type="radio"
            name="gridSize"
            value="12"
            checked={gridSize === 12}
            onChange={() => setGridSize(12)}
          />{' '}
          12개
        </label>
        <label>
          <input
            type="radio"
            name="gridSize"
            value="30"
            checked={gridSize === 30}
            onChange={() => setGridSize(30)}
          />{' '}
          30개
        </label>
      </div>
      <div style={{ display: 'none' }} ref={qrCodeRef}>
        <div ref={qrCodeRef}>
          <QRCodeCanvas value={qrCodeValue} size={256} />
        </div>
      </div>
    </div>
  );
}

export default QRCodePrinter;

import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/button';
import { PrinterCheck } from 'lucide-react';

function QRCodePrinter({ qrCodeValue, qrCodeName, qrCodeRef }) {
  const printQRCode = () => {
    if (!qrCodeRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const svgElement = qrCodeRef.current.querySelector('svg');

    if (!svgElement) {
      console.error('출력할 이미지를 찾을 수 없습니다.');
      return;
    }
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();

    img.onload = () => {
      printWindow.document.write(`
        <html>
          <head>
            <style>
              body { text-align: center; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <h2>${qrCodeName || 'QR Code'}</h2>
            <img src="${img.src}" alt="QR Code" />
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div>
      <Button onClick={printQRCode} variant="gray-ghost" className="size:icon">
        <PrinterCheck width={30} height={30} />
      </Button>
      <div style={{ display: 'none' }}>
        <div ref={qrCodeRef}>
          <QRCodeCanvas value={qrCodeValue} size={256} />
        </div>
      </div>
    </div>
  );
}

export default QRCodePrinter;

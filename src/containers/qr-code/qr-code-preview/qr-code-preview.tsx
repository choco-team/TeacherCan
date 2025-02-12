import { ForwardedRef, forwardRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import TeacherCanIcon from '@/assets/icons/TeacehrCanIcon';
import useDevice from '@/hooks/use-device';
import { QRCode } from '../qr-code.types';

type Props = {
  qrCode: QRCode;
  isPending: boolean;
};

function QrCodePreview(
  { qrCode, isPending }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const { isMobile } = useDevice();

  const qrCodeSize = isMobile ? 300 : 400;

  return (
    <div className="shadow-2xl rounded-xl overflow-hidden flex justify-center items-center">
      <div ref={ref} className="space-y-5 p-5">
        {qrCode.value ? (
          <QRCodeCanvas
            value={qrCode.value}
            title={qrCode.name}
            size={qrCodeSize}
            className={isPending && 'opacity-70'}
          />
        ) : (
          <TeacherCanIcon width={qrCodeSize} height={qrCodeSize} />
        )}

        {qrCode.name && (
          <p className="text-center text-lg text-black font-semibold">
            {qrCode.name}
          </p>
        )}
      </div>
    </div>
  );
}

export default forwardRef(QrCodePreview);

import { ForwardedRef, forwardRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import TeacherCanIcon from '@/assets/icons/TeacehrCanIcon';
import useDevice from '@/hooks/use-device';
import { cn } from '@/styles/utils';
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

  const qrCodeSize = isMobile ? 200 : 280;

  return (
    <div className="self-center min-h-[calc(240px+4.5rem)] md:min-h-[calc(320px+4.5rem)]">
      <div
        className={cn(
          'p-6 w-[240px] md:w-[320px] min-h-[240px] md:min-h-[320px]',
          'shadow-xl rounded-lg border border-gray-200 overflow-hidden flex justify-center items-center',
        )}
      >
        <div
          ref={ref}
          className={cn(
            'flex flex-col items-center justify-center gap-y-5',
            'w-full',
          )}
        >
          {qrCode.value ? (
            <QRCodeCanvas
              value={qrCode.value}
              title={qrCode.name}
              size={qrCodeSize}
              className={cn('size-full', isPending && 'opacity-70')}
            />
          ) : (
            <TeacherCanIcon width={qrCodeSize / 2} height={qrCodeSize / 2} />
          )}

          {qrCode.name && (
            <p
              className={cn(
                'text-center text-xl text-text-title font-semibold',
                'max-sm:text-lg',
              )}
            >
              {qrCode.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default forwardRef(QrCodePreview);

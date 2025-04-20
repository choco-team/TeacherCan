import { Badge } from '@/components/badge';
import { Skeleton } from '@/components/skeleton';
import { Heading4 } from '@/components/heading';
import type { SavedQRCodes, QRCode } from '../../qr-code.types';

type Props = {
  savedQRCodes: SavedQRCodes;
  setQrCode: (qrCode: QRCode) => void;
  setQrCodeInputValue: (value: string) => void;
  handleDeleteQRCode: (id: string) => void;
};

export default function QrCodeBookmarks({
  savedQRCodes,
  setQrCode,
  setQrCodeInputValue,
  handleDeleteQRCode,
}: Props) {
  console.log(savedQRCodes);

  return (
    <div className="w-full max-w-96">
      <Heading4 className="font-semibold text-lg mb-4">북마크</Heading4>

      <div className="flex flex-wrap gap-2">
        <p className="w-full flex gap-x-1 text-start text-sm text-gray-500 mb-2">
          최대 10개까지 저장할 수 있어요.
        </p>

        {!savedQRCodes && <Skeleton className="w-full h-6" />}

        <ul className="flex flex-wrap gap-2">
          {savedQRCodes?.map((entry) => (
            <Badge
              key={entry.id}
              variant="primary"
              size="sm"
              className="cursor-pointer flex items-center space-x-2 relative"
              onClick={() => {
                setQrCode({ value: entry.url, name: entry.title });
                setQrCodeInputValue(entry.url);
              }}
            >
              {entry.title}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteQRCode(entry.id);
                }}
                className="ml-2 text-red-300 hover:text-red-700 text-xs"
              >
                ✕
              </button>
            </Badge>
          ))}
        </ul>
      </div>
    </div>
  );
}

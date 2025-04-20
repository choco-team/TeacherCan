import { nanoid } from 'nanoid';
import { BookmarkIcon as BookmarkOutlineIcon } from 'lucide-react';
import { Button } from '@/components/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/styles/utils';
import type { QRCode, SavedQRCodes } from '../../qr-code.types';
import { QR_CODE_BOOKMARKS_MAX_LENGTH } from '../../qr-code.constants';

type Props = {
  qrCode: QRCode;
  savedQRCodes: SavedQRCodes;
  setSavedQRCodes: (
    value: SavedQRCodes | ((val: SavedQRCodes) => SavedQRCodes),
  ) => void;
};

export default function QrCodeBookmark({
  qrCode,
  savedQRCodes,
  setSavedQRCodes,
}: Props) {
  const { toast } = useToast();

  const isSaved = savedQRCodes?.some(
    (savedQrCode) => savedQrCode.url === qrCode.value,
  );

  const handleSaveToLocalStorage = () => {
    if (!qrCode.name) {
      toast({
        title: 'QR코드 제목을 입력해주세요.',
        variant: 'default',
      });
      return;
    }

    if (savedQRCodes.length >= QR_CODE_BOOKMARKS_MAX_LENGTH) {
      toast({
        title: `최대 ${QR_CODE_BOOKMARKS_MAX_LENGTH}개까지 저장할 수 있어요.`,
        variant: 'error',
      });
      return;
    }

    const newEntry = {
      id: nanoid(),
      date: new Date().toISOString(),
      url: qrCode.value,
      title: qrCode.name,
    };

    setSavedQRCodes((prev) => [...prev, newEntry]);
  };

  return (
    <Button
      disabled={!qrCode.value}
      variant="secondary-outline"
      size="sm"
      className="self-center flex items-center gap-x-1.5"
      onClick={handleSaveToLocalStorage}
    >
      <BookmarkOutlineIcon
        className={cn('size-5', isSaved && 'fill-inherit')}
      />
      북마크에 추가
    </Button>
  );
}

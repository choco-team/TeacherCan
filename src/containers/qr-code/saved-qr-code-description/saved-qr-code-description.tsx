import { Skeleton } from '@/components/skeleton';
import { InfoIcon } from 'lucide-react';
import { SavedQRCodes } from '../qr-code.types';

type Props = {
  savedQRCodes: SavedQRCodes | null;
  hasSavedQRCodes: boolean;
};

export default function SavedQrCodeDescription({
  savedQRCodes,
  hasSavedQRCodes,
}: Props) {
  if (!savedQRCodes) {
    return (
      <span className="w-full flex gap-x-1 text-start text-sm text-gray-500 mb-2">
        <Skeleton className="w-full h-6" />
      </span>
    );
  }

  return (
    <span className="w-full flex gap-x-1 text-start text-sm text-gray-500 mb-2">
      {savedQRCodes ? (
        <InfoIcon className="mt-0.5 size-4 text-secondary" />
      ) : null}
      {hasSavedQRCodes
        ? '북마크는 최대 10개까지 저장할 수 있어요. 더 추가하려면 기존 북마크를 삭제해 주세요.'
        : '현재 북마크가 없어요. 새로운 북마크를 생성하면 편리하게 저장할 수 있어요.'}
    </span>
  );
}

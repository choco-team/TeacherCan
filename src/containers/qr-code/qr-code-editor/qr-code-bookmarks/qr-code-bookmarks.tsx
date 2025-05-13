import Image from 'next/image';
import { useState } from 'react';
import { XIcon } from 'lucide-react';
import { Badge } from '@/components/badge';
import { Skeleton } from '@/components/skeleton';
import { Heading2 } from '@/components/heading';
import { Button } from '@/components/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/tooltip';
import { getFaviconUrl } from '@/containers/qr-code/qr-code.utils';
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
  const [faviconErrors, setFaviconErrors] = useState<Record<string, boolean>>(
    {},
  );

  const handleFaviconError = (id: string) => {
    setFaviconErrors((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  return (
    <div className="flex flex-col gap-y-4">
      <Heading2>북마크</Heading2>

      {savedQRCodes && savedQRCodes.length === 0 && (
        <p className="text-sm text-gray-300">저장된 북마크가 없어요.</p>
      )}

      <div className="flex flex-wrap gap-2">
        {!savedQRCodes && (
          <>
            <Skeleton className="w-2/6 h-[1.875rem]" />
            <Skeleton className="w-3/6 h-[1.875rem]" />
            <Skeleton className="w-3/6 h-[1.875rem]" />
            <Skeleton className="w-2/6 h-[1.875rem]" />
          </>
        )}

        <ul className="flex flex-wrap gap-2.5">
          <TooltipProvider>
            {savedQRCodes?.map(({ id, url, title }) => {
              const faviconUrl = getFaviconUrl(url);
              const isFaviconError = faviconErrors[id];

              return (
                <Tooltip key={id}>
                  <TooltipTrigger>
                    <Badge
                      key={id}
                      variant="gray"
                      className="cursor-pointer flex items-center gap-x-1.5 ps-2 pe-1 py-1 text-sm"
                      onClick={() => {
                        setQrCode({ value: url, name: title });
                        setQrCodeInputValue(url);
                      }}
                    >
                      {faviconUrl && !isFaviconError && (
                        <Image
                          src={faviconUrl}
                          alt="favicon"
                          width={14}
                          height={14}
                          onError={() => handleFaviconError(id)}
                        />
                      )}
                      {title}
                      <Button
                        type="button"
                        size="icon"
                        variant="primary-ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQRCode(id);
                        }}
                        className="size-5 p-0.5 rounded-full"
                        asChild
                      >
                        <XIcon />
                      </Button>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{url}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </ul>
      </div>
    </div>
  );
}

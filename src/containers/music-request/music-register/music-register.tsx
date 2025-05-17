import { Button } from '@/components/button';
import { useState } from 'react';
import { Input } from '@/components/input';
import { ClipboardPaste, LoaderCircle } from 'lucide-react';
import { Label } from '@/components/label';
import { useCreateMusicRequestMusic } from '@/hooks/apis/music-request/use-create-music-request-music';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/alert-dialog';
import { isValidUrl, isYoutubeUrl } from './music-register.utils';
import MusicTitle from './music-title';

type Props = {
  roomId: string;
  studentName: string;
};

export default function MusicRegister({ roomId, studentName }: Props) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>();

  const { mutate: requestMusic, isPending } = useCreateMusicRequestMusic();

  const openAlertWithMessage = (message: string) => {
    setAlertOpen(true);
    setAlertMessage(message);
  };

  const [result, setResult] = useState<{
    value: string | null;
    musicId?: string;
  }>({
    value: null,
  });
  const [title, setTitle] = useState<string>(null);

  const handleRequestMusic = () => {
    requestMusic(
      {
        roomId,
        student: studentName,
        musicId: result.musicId,
        title,
      },
      {
        onSuccess: () => {
          openAlertWithMessage('음악 신청이 완료되었습니다.');
        },
        onError: (error) => {
          openAlertWithMessage(error.message);
        },
      },
    );
  };

  const handelClickClipboardPaste = async () => {
    const url = await navigator.clipboard.readText();

    if (!isValidUrl(url)) {
      return setResult({
        value: '주소가 올바르지 않아요. 다시 시도해주세요.',
      });
    }
    if (!isYoutubeUrl(url)) {
      return setResult({
        value: '유튜브 주소가 아니에요. 다시 시도해주세요.',
      });
    }

    const parsedUrl = new URL(url);
    const { hostname } = parsedUrl;

    if (hostname === 'youtu.be') {
      return setResult({
        value: `유튜브 음악 아이디: ${parsedUrl.pathname.slice(1)}`,
        musicId: parsedUrl.pathname.slice(1),
      });
    }

    const id = parsedUrl.searchParams.get('v');

    if (hostname.includes('youtube.com') && id) {
      return setResult({
        value: `유튜브 음악 아이디: ${parsedUrl.searchParams.get('v')}`,
        musicId: parsedUrl.searchParams.get('v'),
      });
    }

    if (hostname.includes('youtube.com') && !id) {
      return setResult({
        value: `'유튜브 음악 아이디를 찾지 못했어요.'`,
      });
    }

    return setResult({
      value: '주소가 올바르지 않아요. 다시 시도해주세요.',
    });
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div>
        <Label htmlFor="link" className="mb-2 text-text-title">
          불러오기 결과
        </Label>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2 ">
            <Input
              value={result.value ?? ''}
              placeholder="유튜브 주소복사 후 오른쪽 버튼 클릭"
              className="bg-gray-100 border-gray-300 placeholder:text-gray-400"
              readOnly
            />
          </div>
          <Button
            onClick={handelClickClipboardPaste}
            size="sm"
            variant="gray-outline"
            className="px-3"
          >
            <span className="sr-only">Copy</span>
            <ClipboardPaste />
          </Button>
        </div>
      </div>
      {result.musicId ? (
        <>
          <div className="w-full aspect-video relative">
            <Image
              className="object-cover aspect-square rounded-sm"
              src={`https://i.ytimg.com/vi/${result.musicId}/hqdefault.jpg`}
              alt=""
              fill
            />
          </div>
          <MusicTitle musicId={result.musicId} setTitle={setTitle} />
          <Button
            variant="primary"
            size="sm"
            onClick={handleRequestMusic}
            disabled={!title}
          >
            {isPending ? (
              <LoaderCircle
                size="18px"
                className="animate-spin text-primary-50"
              />
            ) : (
              '신청하기'
            )}
          </Button>
        </>
      ) : null}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="hidden">title</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

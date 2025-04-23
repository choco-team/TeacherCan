import { Button } from '@/components/button';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Input } from '@/components/input';
import { ClipboardPaste, LoaderCircle } from 'lucide-react';
import { Label } from '@/components/label';
import { useCreateMusicRequestMusic } from '@/hooks/apis/music-request/use-create-music-request-music';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/skeleton';
import { isValidUrl, isYoutubeUrl } from './register.utils';
import { useMusicRequestStudentAction } from '../../../music-request-student-provider/music-request-student-provider.hooks';

const originURL = process.env.NEXT_PUBLIC_API_BASE_URL;

type MusicTitleProps = {
  musicId: string;
  setTitle: Dispatch<SetStateAction<string>>;
};

function MusicTitle({ musicId, setTitle }: MusicTitleProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: [musicId],
    queryFn: () =>
      fetch(`${originURL}/api/youtube/video/title/${musicId}`).then((res) =>
        res.json(),
      ),
  });

  useEffect(() => {
    if (!data || isLoading) {
      return;
    }

    setTitle(data.title);
  }, [data]);

  if (isLoading) {
    return (
      <Skeleton className="w-full h-[20px] bg-gray-100 dark:bg-gray-800" />
    );
  }

  if (error) {
    return (
      <span className="text-text-subtitle">
        음악 제목을 찾지 못했어요. 다시 시도해주세요.
      </span>
    );
  }

  return <span className="text-text-title">{data.title}</span>;
}

type Props = {
  roomId: string;
  studentName: string;
};

export default function Register({ roomId, studentName }: Props) {
  const { mutate: requestMusic, isPending } = useCreateMusicRequestMusic();
  const { openAlertWithMessage } = useMusicRequestStudentAction();

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
    </div>
  );
}

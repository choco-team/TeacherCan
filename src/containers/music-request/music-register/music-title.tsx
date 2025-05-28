import { Dispatch, SetStateAction, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/skeleton';

const originURL = process.env.NEXT_PUBLIC_API_BASE_URL;

type MusicTitleProps = {
  musicId: string;
  setTitle: Dispatch<SetStateAction<string>>;
};

export default function MusicTitle({ musicId, setTitle }: MusicTitleProps) {
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

import { youtubeSearch } from '@/utils/api/youtubeAPI';
import { useState } from 'react';

export type YoutubeVideo = {
  musicId: string;
  videoId: string;
  title: string;
  proposer: string;
  playCount: number;
};

export const useSearchMusic = () => {
  const [isLoading, setIsLoading] = useState<boolean | null>();
  const [videos, setVideos] = useState<YoutubeVideo[]>();

  const searchMusic = async (
    q: string,
    { onError, onSuccess }: { onError: () => void; onSuccess: () => void },
  ) => {
    try {
      setIsLoading(true);
      setVideos(await youtubeSearch(q));
    } catch (error) {
      onError?.();
      throw Error(error.message);
    } finally {
      setIsLoading(false);
      onSuccess?.();
    }
  };

  return { videos, isLoading, searchMusic };
};

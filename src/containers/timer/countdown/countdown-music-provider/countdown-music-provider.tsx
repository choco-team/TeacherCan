import {
  createContext,
  Dispatch,
  type ReactNode,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getMusicTitle } from '@/utils/api/youtubeAPI';
import {
  useCountdownAction,
  useCountdownState,
} from '../countdown-provider/countdown-provider.hooks';

export type Video = {
  videoId: string;
  title: string;
  publishedAt: string;
  channelTitle: string;
};

export type Music = {
  videoId: string;
  title: string;
};

type CountdownMusicState = {
  music: Music;
  previewYoutubePlayerRef: React.MutableRefObject<YT.Player>;
  volumeValue: number;
  isPreviewYoutubeReady: boolean;
  isOpenMusicSearch: boolean;
  videos: Video[];
  searchInput: string;
};

export const CountdownMusicStateContext =
  createContext<CountdownMusicState | null>(null);

type CountdownMusicAction = {
  getYoutubeMusicURL: (url: string) => void;
  toggleMusicUsed: () => void;
  controlVolume: Dispatch<SetStateAction<number>>;
  controlIsPreviewYoutubeReady: Dispatch<SetStateAction<boolean>>;
  controlOpenMusicSearch: Dispatch<SetStateAction<boolean>>;
  controlVideos: Dispatch<SetStateAction<Video[]>>;
  controlMusic: (music: Music) => void;
  controlSearchInput: Dispatch<SetStateAction<string>>;
};

export const CountdownMusicActionContext =
  createContext<CountdownMusicAction | null>(null);

type Props = {
  children: ReactNode;
};

export const formSchema = z.object({
  youtubeUrl: z
    .string()
    .regex(/(v=)\S+/g)
    .or(z.string().regex(/(youtu.be\/)\S+/g)),
});

export default function CountdownMusicProvider({ children }: Props) {
  const [music, setMusic] = useState({
    videoId: '',
    title: '',
  });
  const [volumeValue, setVolumeValue] = useState(50);
  const [isPreviewYoutubeReady, setIsPreviewYoutubeReady] = useState(false);

  const { isActive, isMusicUsed } = useCountdownState();
  const { setIsMusicUsed, toggleMusicPlay } = useCountdownAction();
  const previewYoutubePlayerRef = useRef<YT.Player>(null);
  const [isOpenMusicSearch, setIsOpenMusicSearch] = useState<boolean>(false);
  const [videos, setVideos] = useState<Video[]>();
  const [searchInput, setSearchInput] = useState<string>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      youtubeUrl: '',
    },
    reValidateMode: 'onSubmit',
  });

  const controlMusic = useCallback(
    (musicData: Music) => {
      setMusic(musicData);
      toggleMusicPlay('off');
      setIsMusicUsed(true);
    },
    [setIsMusicUsed, toggleMusicPlay],
  );

  const getYoutubeMusicURL = useCallback(
    async (url: string) => {
      try {
        let videoId = '';

        if (url.includes('youtube.com')) {
          // 주소창 URL
          [videoId] = url.split('v=')[1].split('&');
        } else if (url.includes('youtu.be')) {
          // 공유 URL
          [videoId] = url.split('youtu.be/')[1].split('?');
        }
        if (music.videoId === videoId) {
          return;
        }

        setIsPreviewYoutubeReady(false);
        const title = await getMusicTitle(videoId);

        controlMusic({ title, videoId });
      } catch (error) {
        throw Error(error.message);
      }
    },
    [music, controlMusic],
  );

  const toggleMusicUsed = useCallback(() => {
    const prevUsedState = isMusicUsed;
    if (isActive) toggleMusicPlay(prevUsedState ? 'off' : 'on');
    setIsMusicUsed((prev) => !prev);
  }, [isMusicUsed, isActive, toggleMusicPlay, setIsMusicUsed]);

  const controlVolume = useCallback(setVolumeValue, [setVolumeValue]);

  const controlIsPreviewYoutubeReady = useCallback(setIsPreviewYoutubeReady, [
    setIsPreviewYoutubeReady,
  ]);

  const controlOpenMusicSearch = useCallback(setIsOpenMusicSearch, [
    setIsOpenMusicSearch,
  ]);

  const controlVideos = useCallback(setVideos, [setVideos]);

  const controlSearchInput = useCallback(setSearchInput, [setSearchInput]);

  const defaultCountdownMusicStateValue = useMemo<CountdownMusicState>(
    () => ({
      music,
      previewYoutubePlayerRef,
      volumeValue,
      isPreviewYoutubeReady,
      isOpenMusicSearch,
      videos,
      searchInput,
    }),
    [
      music,
      previewYoutubePlayerRef,
      volumeValue,
      isPreviewYoutubeReady,
      isOpenMusicSearch,
      videos,
      searchInput,
    ],
  );

  const defaultCountdownMusicActionValue = useMemo<CountdownMusicAction>(
    () => ({
      getYoutubeMusicURL,
      toggleMusicUsed,
      controlVolume,
      controlIsPreviewYoutubeReady,
      controlOpenMusicSearch,
      controlVideos,
      controlMusic,
      controlSearchInput,
    }),
    [
      getYoutubeMusicURL,
      toggleMusicUsed,
      controlVolume,
      controlIsPreviewYoutubeReady,
      controlOpenMusicSearch,
      controlVideos,
      controlMusic,
      controlSearchInput,
    ],
  );

  return (
    <CountdownMusicStateContext.Provider
      value={defaultCountdownMusicStateValue}
    >
      <CountdownMusicActionContext.Provider
        value={defaultCountdownMusicActionValue}
      >
        <FormProvider {...form}>{children}</FormProvider>
      </CountdownMusicActionContext.Provider>
    </CountdownMusicStateContext.Provider>
  );
}

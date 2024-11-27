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
import {
  useCountdownAction,
  useCountdownState,
} from '../countdown-provider/countdown-provider.hooks';

type CountdownMusicState = {
  music: {
    videoId: string;
    title: string;
  };
  previewYoutubePlayerRef: React.MutableRefObject<YT.Player>;
  volumeValue: number;
  isPreviewYoutubeReady: boolean;
};

export const CountdownMusicStateContext =
  createContext<CountdownMusicState | null>(null);

type CountdownMusicAction = {
  getYoutubeMusicURL: (url: string) => void;
  toggleMusicUsed: () => void;
  controlVolume: Dispatch<SetStateAction<number>>;
  controlIsPreviewYoutubeReady: Dispatch<SetStateAction<boolean>>;
};

export const CountdownMusicActionContext =
  createContext<CountdownMusicAction | null>(null);

type Props = {
  children: ReactNode;
};

const YOUTUBE_URL_ERROR_MESSAGE = {
  INVALID_INPUT: '유튜브 동영상 URL을 다시 확인해주세요.',
  API_ERROR: '동영상을 찾지 못했어요. 다시 시도해주세요.',
} as const;

const formSchema = z.object({
  youtubeUrl: z
    .string()
    .regex(/(v=)\S+/g, {
      message: YOUTUBE_URL_ERROR_MESSAGE.INVALID_INPUT,
    })
    .or(
      z.string().regex(/(youtu.be\/)\S+/g, {
        message: YOUTUBE_URL_ERROR_MESSAGE.INVALID_INPUT,
      }),
    ),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      youtubeUrl: '',
    },
    reValidateMode: 'onSubmit',
  });

  const getMusicTitle = async (videoId: string) => {
    const response = await fetch(
      `${window.location.origin}/api/timer/${videoId}`,
    );
    const json = await response.json();
    return json.title;
  };

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
        setMusic({ title, videoId });

        toggleMusicPlay('off');
        setIsMusicUsed(true);
      } catch (error) {
        form.setError('youtubeUrl', {
          message: YOUTUBE_URL_ERROR_MESSAGE.API_ERROR,
        });
      }
    },
    [toggleMusicPlay, setIsMusicUsed, form, music],
  );

  const toggleMusicUsed = useCallback(() => {
    const prevUsedState = isMusicUsed;
    if (isActive) toggleMusicPlay(prevUsedState ? 'off' : 'on');
    setIsMusicUsed((prev) => !prev);
  }, [isMusicUsed, isActive, toggleMusicPlay, setIsMusicUsed]);

  const controlVolume = useCallback(setVolumeValue, [volumeValue]);

  const controlIsPreviewYoutubeReady = useCallback(setIsPreviewYoutubeReady, [
    isPreviewYoutubeReady,
  ]);

  const defaultCountdownMusicStateValue = useMemo<CountdownMusicState>(
    () => ({
      music,
      previewYoutubePlayerRef,
      volumeValue,
      isPreviewYoutubeReady,
    }),
    [music, previewYoutubePlayerRef, volumeValue, isPreviewYoutubeReady],
  );

  const defaultCountdownMusicActionValue = useMemo<CountdownMusicAction>(
    () => ({
      getYoutubeMusicURL,
      toggleMusicUsed,
      controlVolume,
      controlIsPreviewYoutubeReady,
    }),
    [
      getYoutubeMusicURL,
      toggleMusicUsed,
      controlVolume,
      controlIsPreviewYoutubeReady,
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

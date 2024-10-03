import {
  createContext,
  type ReactNode,
  useCallback,
  useMemo,
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
};

export const CountdownMusicStateContext =
  createContext<CountdownMusicState | null>(null);

type CountdownMusicAction = {
  getYoutubeMusicURL: (url: string) => void;
  toggleMusicUsed: () => void;
};

export const CountdownMusicActionContext =
  createContext<CountdownMusicAction | null>(null);

type Props = {
  children: ReactNode;
};

const formSchema = z.object({
  youtubeUrl: z.string().regex(/(v=)\S+/g, {
    message: '유튜브 동영상 URL을 다시 확인해주세요.',
  }),
});

export default function CountdownMusicProvider({ children }: Props) {
  const [music, setMusic] = useState({
    videoId: '',
    title: '',
  });

  const { isActive, isMusicUsed } = useCountdownState();
  const { setIsMusicUsed, toggleMusicPlay } = useCountdownAction();

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
        const videoId = url.split('v=')[1].split('&')[0];
        const title = await getMusicTitle(videoId);
        setMusic({ title, videoId });

        toggleMusicPlay('off');
        setIsMusicUsed(true);
      } catch (error) {
        form.setError('youtubeUrl', {
          message: '동영상을 찾지 못했어요. 다시 시도해주세요.',
        });
      }
    },
    [isActive, toggleMusicPlay, setIsMusicUsed],
  );

  const toggleMusicUsed = useCallback(() => {
    const prevUsedState = isMusicUsed;
    if (isActive) toggleMusicPlay(prevUsedState ? 'off' : 'on');
    setIsMusicUsed((prev) => !prev);
  }, [isMusicUsed, isActive]);

  const defaultCountdownMusicStateValue = useMemo<CountdownMusicState>(
    () => ({
      music,
    }),
    [music],
  );

  const defaultCountdownMusicActionValue = useMemo<CountdownMusicAction>(
    () => ({
      getYoutubeMusicURL,
      toggleMusicUsed,
    }),
    [getYoutubeMusicURL, toggleMusicUsed],
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

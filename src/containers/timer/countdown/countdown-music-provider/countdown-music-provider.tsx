import {
  createContext,
  LegacyRef,
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  useCountdownAction,
  useCountdownState,
} from '../countdown-provider/countdown-provider.hooks';

type CountdownMusicState = {
  isUrlError: boolean;
  defaultValue: string;
  musicTitle: string;
  inputRef: LegacyRef<HTMLInputElement>;
  iframeRef: LegacyRef<HTMLIFrameElement>;
  didMount: MutableRefObject<boolean>;
};

export const CountdownMusicStateContext =
  createContext<CountdownMusicState | null>(null);

type CountdownMusicAction = {
  getYouTubeMusicURL: () => void;
  toggleMusicUsedState: () => void;
  toggleMusicPlayState: () => void;
  pauseMusic: () => void;
};

export const CountdownMusicActionContext =
  createContext<CountdownMusicAction | null>(null);

type Props = {
  children: ReactNode;
};

export default function CountdownMusicProvider({ children }: Props) {
  const { isActive, isMusicPlay } = useCountdownState();
  const { setIsMusicUsed, setIsMusicPlay } = useCountdownAction();
  const [isUrlError, setIsUrlError] = useState(false);
  const [defaultValue, setDefaultValue] = useState(
    'https://www.youtube.com/watch?v=7uRX00jTSA0',
  );
  const [musicTitle, setMusicTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>();
  const iframeRef = useRef<HTMLIFrameElement>();
  const didMount = useRef(false);

  useEffect(() => {
    const postMessage = isMusicPlay ? 'playVideo' : 'pauseVideo';
    iframeRef.current.contentWindow.postMessage(
      `{"event":"command","func":"${postMessage}"}`,
      '*',
    );
  }, [isMusicPlay]);

  const getMusicTitle = async (videoId) => {
    const response = await fetch(`http://localhost:3000/api/timer/${videoId}`);
    const json = await response.json();
    return json.title;
  };

  const getYouTubeMusicURL = useCallback(async () => {
    if (isActive) {
      return;
    }
    try {
      const inputValue = inputRef.current.value;
      const videoId = inputValue.split('v=')[1].split('&')[0];

      iframeRef.current.src = `https://www.youtube.com/embed/${videoId}?loop=1&playlist=${videoId}&enablejsapi=1`;

      setMusicTitle(await getMusicTitle(videoId));
      setDefaultValue(inputValue);
      setIsMusicPlay(false);
      setIsMusicUsed(true);
      setIsUrlError(false);
    } catch {
      setIsUrlError(true);
    }
  }, [isActive, inputRef, iframeRef, setIsMusicPlay, setIsMusicUsed]);

  const toggleMusicUsedState = useCallback(() => {
    if (musicTitle === '') {
      return;
    }
    if (isActive) {
      setIsMusicPlay((prev) => !prev);
    }
    setIsMusicUsed((prev) => !prev);
  }, [isActive, musicTitle, setIsMusicPlay, setIsMusicUsed]);

  const toggleMusicPlayState = useCallback(() => {
    if (musicTitle === '' || isActive) {
      return;
    }
    setIsMusicPlay((prev) => !prev);
  }, [isActive, musicTitle, setIsMusicPlay]);

  const pauseMusic = useCallback(() => {
    setIsMusicPlay(false);
  }, [setIsMusicPlay]);

  const defaultCountdownMusicStateValue = useMemo(
    () => ({
      isUrlError,
      defaultValue,
      inputRef,
      iframeRef,
      musicTitle,
      didMount,
    }),
    [isUrlError, defaultValue, inputRef, iframeRef, musicTitle, didMount],
  );

  const defaultCountdownMusicActionValue = useMemo(
    () => ({
      getYouTubeMusicURL,
      toggleMusicUsedState,
      toggleMusicPlayState,
      pauseMusic,
    }),
    [
      getYouTubeMusicURL,
      toggleMusicUsedState,
      toggleMusicPlayState,
      pauseMusic,
    ],
  );

  return (
    <CountdownMusicStateContext.Provider
      value={defaultCountdownMusicStateValue}
    >
      <CountdownMusicActionContext.Provider
        value={defaultCountdownMusicActionValue}
      >
        {children}
      </CountdownMusicActionContext.Provider>
    </CountdownMusicStateContext.Provider>
  );
}

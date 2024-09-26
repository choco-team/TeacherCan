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
import { useCountdownState } from '../countdown-provider/countdown-provider.hooks';

type CountdownMusicState = {
  isMusicPlay: boolean;
  isUrlError: boolean;
  isMusicUsed: boolean;
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
  const { isActive } = useCountdownState();
  const [isMusicPlay, setIsMusicPlay] = useState(false);
  const [isMusicUsed, setIsMusicUsed] = useState(false);
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

  useEffect(() => {
    if (!isMusicUsed) {
      return;
    }
    if (isActive) {
      setIsMusicPlay(true);
    } else {
      setIsMusicPlay(false);
    }
  }, [isMusicUsed, isActive]);

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

      setDefaultValue(inputValue);
      setMusicTitle(await getMusicTitle(videoId));
      iframeRef.current.src = `https://www.youtube.com/embed/${videoId}?loop=1&playlist=${videoId}&enablejsapi=1`;

      setIsMusicPlay(false);
      setIsMusicUsed(true);
      setIsUrlError(false);
    } catch {
      setIsUrlError(true);
    }
  }, [isActive, inputRef, iframeRef]);

  const toggleMusicUsedState = useCallback(() => {
    if (musicTitle === '') {
      return;
    }
    if (isMusicUsed) {
      setIsMusicUsed(false);
      setIsMusicPlay(false);
    } else if (isActive) {
      setIsMusicPlay(true);
    }
    setIsMusicUsed((prev) => !prev);
  }, [isActive, isMusicUsed, musicTitle]);

  const toggleMusicPlayState = useCallback(() => {
    if (musicTitle === '' || isActive) {
      return;
    }
    setIsMusicPlay((prev) => !prev);
  }, [isActive, isMusicPlay, musicTitle]);

  const pauseMusic = useCallback(() => {
    setIsMusicPlay(false);
  }, []);

  const defaultCountdownMusicStateValue = useMemo(
    () => ({
      isMusicPlay,
      isUrlError,
      isMusicUsed,
      defaultValue,
      inputRef,
      iframeRef,
      musicTitle,
      didMount,
    }),
    [
      isMusicPlay,
      isUrlError,
      isMusicUsed,
      defaultValue,
      inputRef,
      iframeRef,
      musicTitle,
      didMount,
    ],
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

import {
  createContext,
  LegacyRef,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useCountdownState } from '../countdown-provider/countdown-provider.hooks';

type CountdownMusicState = {
  isPlay: boolean;
  isUrlError: boolean;
  defaultValue: string;
  inputRef: LegacyRef<HTMLInputElement>;
  iframeRef: LegacyRef<HTMLIFrameElement>;
  playBtnRef: LegacyRef<HTMLButtonElement>;
};

export const CountdownMusicStateContext =
  createContext<CountdownMusicState | null>(null);

type CountdownMusicAction = {
  onClickGetBtn: () => void;
  onClickPlayBtn: () => void;
  pauseMusic: () => void;
};

export const CountdownMusicActionContext =
  createContext<CountdownMusicAction | null>(null);

type Props = {
  children: ReactNode;
};

export default function CountdownMusicProvider({ children }: Props) {
  const { isActive } = useCountdownState();
  const [isPlay, setIsPlay] = useState(false);
  const [isUrlError, setURLError] = useState(false);
  const [defaultValue, setDefaultValue] = useState(
    'https://www.youtube.com/watch?v=7uRX00jTSA0',
  );

  const inputRef = useRef<HTMLInputElement>();
  const iframeRef = useRef<HTMLIFrameElement>();
  const playBtnRef = useRef<HTMLButtonElement>();

  useEffect(() => {
    const postMessage = isPlay ? 'playVideo' : 'pauseVideo';
    iframeRef.current.contentWindow.postMessage(
      `{"event":"command","func":"${postMessage}"}`,
      '*',
    );
  }, [isPlay]);

  useEffect(() => {
    if (isActive) {
      setIsPlay(true);
    } else {
      setIsPlay(false);
    }
  }, [isActive]);

  const onClickGetBtn = useCallback(() => {
    try {
      const inputValue = inputRef.current.value;
      setDefaultValue(inputValue);
      const videoId = inputValue.split('v=')[1].split('&')[0];
      iframeRef.current.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&enablejsapi=1`;
      setIsPlay(true);
      playBtnRef.current.innerHTML = '일시정지';
      setURLError(false);
    } catch {
      setURLError(true);
    }
  }, [inputRef, iframeRef]);

  const onClickPlayBtn = useCallback(() => {
    playBtnRef.current.innerHTML = isPlay ? '재생' : '일시정지';
    setIsPlay(!isPlay);
  }, [isPlay, playBtnRef]);

  const pauseMusic = useCallback(() => {
    setIsPlay(false);
  }, []);

  const defaultCountdownMusicStateValue = useMemo(
    () => ({
      isPlay,
      isUrlError,
      inputRef,
      iframeRef,
      playBtnRef,
      defaultValue,
    }),
    [isPlay, isUrlError, inputRef, iframeRef, playBtnRef],
  );

  const defaultCountdownMusicActionValue = useMemo(
    () => ({
      onClickGetBtn,
      onClickPlayBtn,
      pauseMusic,
    }),
    [onClickGetBtn, onClickPlayBtn, pauseMusic],
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

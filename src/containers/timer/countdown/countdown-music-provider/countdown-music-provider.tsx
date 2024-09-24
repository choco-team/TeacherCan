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
  onClickGetBtn: () => void;
  onClickInsertRemoveBtn: () => void;
  onClickPlayPauseBtn: () => void;
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
  const [isUrlError, setURLError] = useState(false);

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

  const onClickGetBtn = useCallback(() => {
    if (isActive) {
      return;
    }
    try {
      const inputValue = inputRef.current.value;
      setDefaultValue(inputValue);
      const videoId = inputValue.split('v=')[1].split('&')[0];

      // 백엔드 api 만들어서 videoId로 유투브 제목 가져오기
      setMusicTitle(videoId);

      iframeRef.current.src = `https://www.youtube.com/embed/${videoId}?loop=1&playlist=${videoId}&enablejsapi=1`;
      setIsMusicUsed(true);
      setURLError(false);
    } catch {
      setURLError(true);
    }
  }, [isActive, inputRef, iframeRef]);

  const onClickInsertRemoveBtn = useCallback(() => {
    if (musicTitle === '') {
      return;
    }
    if (isMusicUsed) {
      setIsMusicUsed(false);
      setIsMusicPlay(false);
    } else if (isActive) {
      setIsMusicPlay(true);
    }
    setIsMusicUsed(!isMusicUsed);
  }, [isActive, isMusicUsed, musicTitle]);

  const onClickPlayPauseBtn = useCallback(() => {
    if (musicTitle === '' || isActive) {
      return;
    }
    setIsMusicPlay(!isMusicPlay);
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
      onClickGetBtn,
      onClickInsertRemoveBtn,
      onClickPlayPauseBtn,
      pauseMusic,
    }),
    [onClickGetBtn, onClickInsertRemoveBtn, onClickPlayPauseBtn, pauseMusic],
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

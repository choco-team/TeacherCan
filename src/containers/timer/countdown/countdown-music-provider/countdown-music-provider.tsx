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

type CountdownMusicState = {
  isPlay: boolean;
  isUrlError: boolean;
  inputRef: LegacyRef<HTMLInputElement>;
  iframeRef: LegacyRef<HTMLIFrameElement>;
  playBtnRef: LegacyRef<HTMLButtonElement>;
};

export const CountdownMusicStateContext =
  createContext<CountdownMusicState | null>(null);

type CountdownMusicAction = {
  onClickGetBtn: () => void;
  onClickPlayBtn: () => void;
};

export const CountdownMusicActionContext =
  createContext<CountdownMusicAction | null>(null);

type Props = {
  children: ReactNode;
};

export default function CountdownMusicProvider({ children }: Props) {
  const [isPlay, setIsplay] = useState(false);
  const [isUrlError, setURLError] = useState(false);
  const inputRef = useRef<HTMLInputElement>();
  const iframeRef = useRef<HTMLIFrameElement>();
  const playBtnRef = useRef<HTMLButtonElement>();

  const onClickGetBtn = useCallback(() => {
    try {
      const videoId = inputRef.current.value.split('v=')[1].split('&')[0];
      iframeRef.current.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&enablejsapi=1`;
      setIsplay(true);
      playBtnRef.current.innerHTML = '일시정지';
      setURLError(false);
    } catch (e) {
      setURLError(true);
      console.log(e.message);
    }
  }, []);

  const onClickPlayBtn = () => {
    const postMessage = isPlay ? 'pauseVideo' : 'playVideo';
    playBtnRef.current.innerHTML = isPlay ? '재생' : '일시정지';
    iframeRef.current.contentWindow.postMessage(
      `{"event":"command","func":"${postMessage}"}`,
      '*',
    );
    setIsplay(!isPlay);
  };

  useEffect(() => {}, []);

  const defaultCountdownMusicStateValue = useMemo(
    () => ({
      isPlay,
      isUrlError,
      inputRef,
      iframeRef,
      playBtnRef,
    }),
    [isPlay, isUrlError, inputRef, iframeRef, playBtnRef],
  );

  const defaultCountdownMusicActionValue = useMemo(
    () => ({
      onClickGetBtn,
      onClickPlayBtn,
    }),
    [onClickGetBtn, onClickPlayBtn],
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

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from 'react';

export type MusicRequestTeacherParams = {
  roomId: string;
};

type Video = {
  videoId: string;
  title: string;
  proposer: string;
  playCount: number;
};

interface PropsWithChildrenParams extends PropsWithChildren {
  params: MusicRequestTeacherParams;
}

type MusicRequestTeacherState = {
  params: MusicRequestTeacherParams;
  roomId: string;
  roomTitle: string;
  videos: Video[];
  numberOfVideos: number;
  currentMusicIndex: number;
  maxPlayCount: number;
  isVideoLoading: boolean;
};

export const MusicRequestTeacherStateContext =
  createContext<MusicRequestTeacherState | null>(null);

type MusicRequestTeacherAction = {
  settingRoomId: Dispatch<SetStateAction<string>>;
  settingRoomTitle: Dispatch<SetStateAction<string>>;
  settingVideos: Dispatch<SetStateAction<Video[]>>;
  settingNumberOfVideos: Dispatch<SetStateAction<number>>;
  setCurrentMusicByIndex: (index: number) => void;
  settingIsVideoLoading: Dispatch<SetStateAction<boolean>>;
};

export const MusicRequestTeacherActionContext =
  createContext<MusicRequestTeacherAction | null>(null);

export default function MusicRequestTeacherProvider({
  children,
  params,
}: PropsWithChildrenParams) {
  const [roomId, setRoomId] = useState();
  const [roomTitle, setRoomTitle] = useState();
  const [videos, setVideos] = useState([]);
  const [numberOfVideos, setNumberOfVideos] = useState(0);
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  const [maxPlayCount, setMaxPlayCount] = useState(1);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  const defaultMusicRequestTeacherStateValue = {
    roomId,
    roomTitle,
    videos,
    params,
    numberOfVideos,
    currentMusicIndex,
    maxPlayCount,
    isVideoLoading,
  };

  const defaultMusicRequestTeacherActionValue = {
    settingRoomId: setRoomId,
    settingRoomTitle: setRoomTitle,
    settingVideos: setVideos,
    settingNumberOfVideos: setNumberOfVideos,
    setCurrentMusicByIndex: (index: number) => {
      setCurrentMusicIndex(index);
      setIsVideoLoading(true);
      setVideos((prevVideos) =>
        prevVideos.map((video, i) => {
          if (i === index) {
            const plusedPlayCount = video.playCount + 1;
            if (plusedPlayCount > maxPlayCount) {
              setMaxPlayCount(plusedPlayCount);
            }
            return { ...video, playCount: plusedPlayCount };
          }
          return video;
        }),
      );
    },
    settingIsVideoLoading: setIsVideoLoading,
  };

  return (
    <MusicRequestTeacherStateContext.Provider
      value={defaultMusicRequestTeacherStateValue}
    >
      <MusicRequestTeacherActionContext.Provider
        value={defaultMusicRequestTeacherActionValue}
      >
        {children}
      </MusicRequestTeacherActionContext.Provider>
    </MusicRequestTeacherStateContext.Provider>
  );
}

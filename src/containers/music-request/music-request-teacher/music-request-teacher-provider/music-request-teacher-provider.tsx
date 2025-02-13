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
};

export const MusicRequestTeacherStateContext =
  createContext<MusicRequestTeacherState | null>(null);

type MusicRequestTeacherAction = {
  settingRoomId: Dispatch<SetStateAction<string>>;
  settingRoomTitle: Dispatch<SetStateAction<string>>;
  settingVideos: Dispatch<SetStateAction<Video[]>>;
  settingNumberOfVideos: Dispatch<SetStateAction<number>>;
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

  const defaultMusicRequestTeacherStateValue = {
    roomId,
    roomTitle,
    videos,
    params,
    numberOfVideos,
  };

  const defaultMusicRequestTeacherActionValue = {
    settingRoomId: setRoomId,
    settingRoomTitle: setRoomTitle,
    settingVideos: setVideos,
    settingNumberOfVideos: setNumberOfVideos,
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

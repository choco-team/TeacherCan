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
};

interface PropsWithChildrenParams extends PropsWithChildren {
  params: MusicRequestTeacherParams;
}

type MusicRequestTeacherState = {
  roomId: string;
  roomTitle: string;
  videos: Video[];
  params: MusicRequestTeacherParams;
};

export const MusicRequestTeacherStateContext =
  createContext<MusicRequestTeacherState | null>(null);

type MusicRequestTeacherAction = {
  settingRoomId: Dispatch<SetStateAction<string>>;
  settingRoomTitle: Dispatch<SetStateAction<string>>;
  settingVideos: Dispatch<SetStateAction<Video[]>>;
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

  const defaultMusicRequestTeacherStateValue = {
    roomId,
    roomTitle,
    videos,
    params,
  };

  const defaultMusicRequestTeacherActionValue = {
    settingRoomId: setRoomId,
    settingRoomTitle: setRoomTitle,
    settingVideos: setVideos,
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

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from 'react';

export type MusicRequestStudentParams = {
  roomId: string;
};

type Video = {
  videoId: string;
  title: string;
  publishedAt: string;
  channelTitle: string;
  isRequested: boolean;
};

interface PropsWithChildrenParams extends PropsWithChildren {
  params: MusicRequestStudentParams;
}

type MusicRequestStudentState = {
  roomId: string;
  studentName: string;
  roomTitle: string;
  videos: Video[];
  params: MusicRequestStudentParams;
  alertOpen: boolean;
  alertMessage: string;
};

export const MusicRequestStudentStateContext =
  createContext<MusicRequestStudentState | null>(null);

type MusicRequestStudentAction = {
  settingRoomId: Dispatch<SetStateAction<string>>;
  settingStudentName: Dispatch<SetStateAction<string>>;
  settingRoomTitle: Dispatch<SetStateAction<string>>;
  settingVideos: Dispatch<SetStateAction<Video[]>>;
  settingAlertOpen: Dispatch<SetStateAction<boolean>>;
  openAlertWithMessage: (message: string) => void;
};

export const MusicRequestStudentActionContext =
  createContext<MusicRequestStudentAction | null>(null);

export default function MusicRequestStudentProvider({
  children,
  params,
}: PropsWithChildrenParams) {
  const [roomId, setRoomId] = useState<string>();
  const [studentName, setStudentName] = useState<string>();
  const [roomTitle, setRoomTitle] = useState<string>();
  const [videos, setVideos] = useState<Video[]>();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>();

  const defaultMusicRequestStudentStateValue = {
    roomId,
    studentName,
    roomTitle,
    videos,
    params,
    alertOpen,
    alertMessage,
  };

  const defaultMusicRequestStudentActionValue = {
    settingRoomId: setRoomId,
    settingStudentName: setStudentName,
    settingRoomTitle: setRoomTitle,
    settingVideos: setVideos,
    settingAlertOpen: setAlertOpen,
    openAlertWithMessage: (message: string) => {
      setAlertOpen(true);
      setAlertMessage(message);
    },
  };

  return (
    <MusicRequestStudentStateContext.Provider
      value={defaultMusicRequestStudentStateValue}
    >
      <MusicRequestStudentActionContext.Provider
        value={defaultMusicRequestStudentActionValue}
      >
        {children}
      </MusicRequestStudentActionContext.Provider>
    </MusicRequestStudentStateContext.Provider>
  );
}

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

interface PropsWithChildrenParams extends PropsWithChildren {
  params: MusicRequestTeacherParams;
}

type MusicRequestTeacherState = {
  roomId: string;
  roomTitle: string;
  params: MusicRequestTeacherParams;
};

export const MusicRequestTeacherStateContext =
  createContext<MusicRequestTeacherState | null>(null);

type MusicRequestTeacherAction = {
  settingRoomId: Dispatch<SetStateAction<string>>;
  settingRoomTitle: Dispatch<SetStateAction<string>>;
};

export const MusicRequestTeacherActionContext =
  createContext<MusicRequestTeacherAction | null>(null);

export default function MusicRequestTeacherProvider({
  children,
  params,
}: PropsWithChildrenParams) {
  const [roomId, setRoomId] = useState();
  const [roomTitle, setRoomTitle] = useState();

  const defaultMusicRequestTeacherStateValue = {
    roomId,
    roomTitle,
    params,
  };

  const defaultMusicRequestTeacherActionValue = {
    settingRoomId: setRoomId,
    settingRoomTitle: setRoomTitle,
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
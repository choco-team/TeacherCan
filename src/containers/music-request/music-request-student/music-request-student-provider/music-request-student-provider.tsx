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

interface PropsWithChildrenParams extends PropsWithChildren {
  params: MusicRequestStudentParams;
}

type MusicRequestStudentState = {
  roomId: string;
  studentName: string;
  roomTitle: string;
  params: MusicRequestStudentParams;
};

export const MusicRequestStudentStateContext =
  createContext<MusicRequestStudentState | null>(null);

type MusicRequestStudentAction = {
  settingRoomId: Dispatch<SetStateAction<string>>;
  settingStudentName: Dispatch<SetStateAction<string>>;
  settingRoomTitle: Dispatch<SetStateAction<string>>;
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

  const defaultMusicRequestStudentStateValue = {
    roomId,
    studentName,
    roomTitle,
    params,
  };

  const defaultMusicRequestStudentActionValue = {
    settingRoomId: setRoomId,
    settingStudentName: setStudentName,
    settingRoomTitle: setRoomTitle,
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

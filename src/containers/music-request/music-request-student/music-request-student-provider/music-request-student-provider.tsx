import Cookies from 'js-cookie';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from 'react';

interface PropsWithChildrenParams extends PropsWithChildren {
  roomId: string;
}

type MusicRequestStudentState = {
  studentName: string;
};

export const MusicRequestStudentStateContext =
  createContext<MusicRequestStudentState | null>(null);

type MusicRequestStudentAction = {
  settingStudentName: Dispatch<SetStateAction<string>>;
};

export const MusicRequestStudentActionContext =
  createContext<MusicRequestStudentAction | null>(null);

export default function MusicRequestStudentProvider({
  children,
  roomId,
}: PropsWithChildrenParams) {
  const [studentName, setStudentName] = useState<string>(
    Cookies.get(roomId) || '',
  );

  const defaultMusicRequestStudentStateValue = {
    studentName,
  };

  const defaultMusicRequestStudentActionValue = {
    settingStudentName: setStudentName,
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

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { getStudentName } from '@/apis/music-request/music-student-storage';

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
  // localStorage 는 서버에서 읽을 수 없어 첫 렌더 이후에 채운다
  const [studentName, setStudentName] = useState<string>('');

  useEffect(() => {
    setStudentName(getStudentName(roomId));
  }, [roomId]);

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

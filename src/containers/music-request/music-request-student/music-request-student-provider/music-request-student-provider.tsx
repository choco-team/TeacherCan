import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from 'react';

interface PropsWithChildrenParams extends PropsWithChildren {}

type MusicRequestStudentState = {
  studentName: string;
  alertOpen: boolean;
  alertMessage: string;
};

export const MusicRequestStudentStateContext =
  createContext<MusicRequestStudentState | null>(null);

type MusicRequestStudentAction = {
  settingStudentName: Dispatch<SetStateAction<string>>;
  settingAlertOpen: Dispatch<SetStateAction<boolean>>;
  openAlertWithMessage: (message: string) => void;
};

export const MusicRequestStudentActionContext =
  createContext<MusicRequestStudentAction | null>(null);

export default function MusicRequestStudentProvider({
  children,
}: PropsWithChildrenParams) {
  const [studentName, setStudentName] = useState<string>();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>();

  const defaultMusicRequestStudentStateValue = {
    studentName,
    alertOpen,
    alertMessage,
  };

  const defaultMusicRequestStudentActionValue = {
    settingStudentName: setStudentName,
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

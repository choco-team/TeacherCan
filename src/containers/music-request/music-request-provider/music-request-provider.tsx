import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from 'react';

type MusicRequestState = {
  roomId: string;
};

export const MusicRequestStateContext = createContext<MusicRequestState | null>(
  null,
);

type MusicRequestAction = {
  settingRoomId: Dispatch<SetStateAction<string>>;
};

export const MusicRequestActionContext =
  createContext<MusicRequestAction | null>(null);

export default function MusicRequestProvider({
  children,
}: PropsWithChildren<{}>) {
  const [roomId, setRoomId] = useState();

  const defaultMusicRequestStateValue = {
    roomId,
  };

  const defaultMusicRequestActionValue = {
    settingRoomId: setRoomId,
  };

  return (
    <MusicRequestStateContext.Provider value={defaultMusicRequestStateValue}>
      <MusicRequestActionContext.Provider
        value={defaultMusicRequestActionValue}
      >
        {children}
      </MusicRequestActionContext.Provider>
    </MusicRequestStateContext.Provider>
  );
}

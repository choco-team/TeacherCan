import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from 'react';

type MusicRequestState = {
  roomID: number;
};

export const MusicRequestStateContext = createContext<MusicRequestState | null>(
  null,
);

type MusicRequestAction = {
  settingRoomID: Dispatch<SetStateAction<number>>;
};

export const MusicRequestActionContext =
  createContext<MusicRequestAction | null>(null);

export default function MusicRequestProvider({
  children,
}: PropsWithChildren<{}>) {
  const [roomID, setRoomID] = useState();

  const defaultMusicRequestStateValue = {
    roomID,
  };

  const defaultMusicRequestActionValue = {
    settingRoomID: setRoomID,
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

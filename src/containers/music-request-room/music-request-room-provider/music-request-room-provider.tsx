import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from 'react';

type MusicRequestRoomState = {
  roomID: string;
};

export const MusicRequestRoomStateContext =
  createContext<MusicRequestRoomState | null>(null);

type MusicRequestRoomAction = {
  settingRoomID: Dispatch<SetStateAction<string>>;
};

export const MusicRequestRoomActionContext =
  createContext<MusicRequestRoomAction | null>(null);

export default function MusicRequestRoomProvider({
  children,
}: PropsWithChildren<{}>) {
  const [roomID, setRoomID] = useState();

  const defaultMusicRequestRoomStateValue = {
    roomID,
  };

  const defaultMusicRequestRoomActionValue = {
    settingRoomID: setRoomID,
  };

  return (
    <MusicRequestRoomStateContext.Provider
      value={defaultMusicRequestRoomStateValue}
    >
      <MusicRequestRoomActionContext.Provider
        value={defaultMusicRequestRoomActionValue}
      >
        {children}
      </MusicRequestRoomActionContext.Provider>
    </MusicRequestRoomStateContext.Provider>
  );
}

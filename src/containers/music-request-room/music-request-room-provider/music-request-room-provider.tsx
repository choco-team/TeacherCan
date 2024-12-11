import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from 'react';

type MusicRequestRoomState = {
  roomId: string;
};

export const MusicRequestRoomStateContext =
  createContext<MusicRequestRoomState | null>(null);

type MusicRequestRoomAction = {
  settingRoomId: Dispatch<SetStateAction<string>>;
};

export const MusicRequestRoomActionContext =
  createContext<MusicRequestRoomAction | null>(null);

export default function MusicRequestRoomProvider({
  children,
}: PropsWithChildren<{}>) {
  const [roomId, setRoomId] = useState();

  const defaultMusicRequestRoomStateValue = {
    roomId,
  };

  const defaultMusicRequestRoomActionValue = {
    settingRoomId: setRoomId,
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

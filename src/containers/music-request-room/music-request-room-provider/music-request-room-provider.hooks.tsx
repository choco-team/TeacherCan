import { useContext } from 'react';
import {
  MusicRequestRoomActionContext,
  MusicRequestRoomStateContext,
} from './music-request-room-provider';

export const useMusicRequestRoomState = () => {
  const value = useContext(MusicRequestRoomStateContext);

  if (!value) {
    throw Error(
      'useMusicRequestRoomState must be used within a MusicRequestRoomProvider. Make sure that the component is wrapped in the MusicRequestRoomProvider.',
    );
  }

  return value;
};

export const useMusicRequestRoomAction = () => {
  const value = useContext(MusicRequestRoomActionContext);

  if (!value) {
    throw Error(
      'useMusicRequestRoomAction must be used within a MusicRequestRoomProvider. Make sure that the component is wrapped in the MusicRequestRoomProvider.',
    );
  }

  return value;
};

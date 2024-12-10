import { useContext } from 'react';
import {
  MusicRequestActionContext,
  MusicRequestStateContext,
} from './music-request-provider';

export const useMusicRequestState = () => {
  const value = useContext(MusicRequestStateContext);

  if (!value) {
    throw Error(
      'useMusicRequestState must be used within a MusicRequestProvider. Make sure that the component is wrapped in the MusicRequestProvider.',
    );
  }

  return value;
};

export const useMusicRequestAction = () => {
  const value = useContext(MusicRequestActionContext);

  if (!value) {
    throw Error(
      'useMusicRequestAction must be used within a MusicRequestProvider. Make sure that the component is wrapped in the MusicRequestProvider.',
    );
  }

  return value;
};

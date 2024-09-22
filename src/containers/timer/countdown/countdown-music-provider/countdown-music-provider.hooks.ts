import { useContext } from 'react';
import {
  CountdownMusicActionContext,
  CountdownMusicStateContext,
} from './countdown-music-provider';

export const useCountdownMusicState = () => {
  const value = useContext(CountdownMusicStateContext);

  if (!value) {
    throw Error(
      'useCountdownMusicState must be used within a CountdownMusicProvider. Make sure that the component is wrapped in the CountdownMusicProvider.',
    );
  }

  return value;
};

export const useCountdownMusicAction = () => {
  const value = useContext(CountdownMusicActionContext);

  if (!value) {
    throw Error(
      'useCountdownMusicAction must be used within a CountdownMusicProvider. Make sure that the component is wrapped in the CountdownMusicProvider.',
    );
  }

  return value;
};

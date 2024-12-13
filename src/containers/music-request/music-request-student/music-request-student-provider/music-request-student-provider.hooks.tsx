import { useContext } from 'react';
import {
  MusicRequestStudentActionContext,
  MusicRequestStudentStateContext,
} from './music-request-student-provider';

export const useMusicRequestStudentState = () => {
  const value = useContext(MusicRequestStudentStateContext);

  if (!value) {
    throw Error(
      'useMusicRequestStudentState must be used within a MusicRequestStudentProvider. Make sure that the component is wrapped in the MusicRequestStudentProvider.',
    );
  }

  return value;
};

export const useMusicRequestStudentAction = () => {
  const value = useContext(MusicRequestStudentActionContext);

  if (!value) {
    throw Error(
      'useMusicRequestStudentAction must be used within a MusicRequestStudentProvider. Make sure that the component is wrapped in the MusicRequestStudentProvider.',
    );
  }

  return value;
};

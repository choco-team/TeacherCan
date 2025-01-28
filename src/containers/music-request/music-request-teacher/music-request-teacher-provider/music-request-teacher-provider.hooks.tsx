import { useContext } from 'react';
import {
  MusicRequestTeacherActionContext,
  MusicRequestTeacherStateContext,
} from './music-request-teacher-provider';

export const useMusicRequestTeacherState = () => {
  const value = useContext(MusicRequestTeacherStateContext);

  if (!value) {
    throw Error(
      'useMusicRequestTeacherState must be used within a MusicRequestTeacherProvider. Make sure that the component is wrapped in the MusicRequestTeacherProvider.',
    );
  }

  return value;
};

export const useMusicRequestTeacherAction = () => {
  const value = useContext(MusicRequestTeacherActionContext);

  if (!value) {
    throw Error(
      'useMusicRequestTeacherAction must be used within a MusicRequestTeacherProvider. Make sure that the component is wrapped in the MusicRequestTeacherProvider.',
    );
  }

  return value;
};

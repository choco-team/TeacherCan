import { useContext } from 'react';
import {
  RandomPickPlaygroundActionContext,
  RandomPickPlaygroundStateContext,
} from './random-pick-playground-provider';

export const useRandomPickPlaygroundState = () => {
  const value = useContext(RandomPickPlaygroundStateContext);

  if (!value) {
    throw Error(
      'useRandomPickPlaygroundState must be used within a RandomPickPlaygroundProvider. Make sure that the component is wrapped in the RandomPickPlaygroundProvider.',
    );
  }

  return value;
};

export const useRandomPickPlaygroundAction = () => {
  const value = useContext(RandomPickPlaygroundActionContext);

  if (!value) {
    throw Error(
      'useRandomPickPlaygroundAction must be used within a RandomPickPlaygroundProvider. Make sure that the component is wrapped in the RandomPickPlaygroundProvider.',
    );
  }

  return value;
};

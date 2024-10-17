import { useContext } from 'react';
import {
  RandomPickActionContext,
  RandomPickStateContext,
} from './random-pick-provider';

export const useRandomPickState = () => {
  const value = useContext(RandomPickStateContext);

  if (!value) {
    throw Error(
      'useRandomPickState must be used within a RandomPickProvider. Make sure that the component is wrapped in the RandomPickProvider.',
    );
  }

  return value;
};

export const useRandomPickAction = () => {
  const value = useContext(RandomPickActionContext);

  if (!value) {
    throw Error(
      'useRandomPickAction must be used within a RandomPickProvider. Make sure that the component is wrapped in the RandomPickProvider.',
    );
  }

  return value;
};

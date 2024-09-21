import { useContext } from 'react';
import {
  CountdownActionContext,
  CountdownStateContext,
} from './countdown-provider';

export const useCountdownState = () => {
  const value = useContext(CountdownStateContext);

  if (!value) {
    throw Error(
      'useCountdownState must be used within a CountdownProvider. Make sure that the component is wrapped in the CountdownProvider.',
    );
  }

  return value;
};

export const useCountdownAction = () => {
  const value = useContext(CountdownActionContext);

  if (!value) {
    throw Error(
      'useCountdownAction must be used within a CountdownProvider. Make sure that the component is wrapped in the CountdownProvider.',
    );
  }

  return value;
};

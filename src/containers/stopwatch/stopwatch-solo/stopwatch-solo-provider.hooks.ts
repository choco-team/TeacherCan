import { useContext } from 'react';
import {
  SoloStopwatchStateContext,
  SoloStopwatchActionContext,
} from './stopwatch-solo-provider';

export const useSoloStopwatchState = () => {
  const context = useContext(SoloStopwatchStateContext);
  if (!context) {
    throw new Error(
      'useSoloStopwatchState must be used within SoloStopwatchProvider',
    );
  }
  return context;
};

export const useSoloStopwatchAction = () => {
  const context = useContext(SoloStopwatchActionContext);
  if (!context) {
    throw new Error(
      'useSoloStopwatchAction must be used within SoloStopwatchProvider',
    );
  }
  return context;
};

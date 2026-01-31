import { useContext } from 'react';
import {
  GroupStopwatchStateContext,
  GroupStopwatchActionContext,
} from './stopwatch-group-provider';

export const useGroupStopwatchState = () => {
  const context = useContext(GroupStopwatchStateContext);
  if (!context) {
    throw new Error(
      'useGroupStopwatchState must be used within GroupStopwatchProvider',
    );
  }
  return context;
};

export const useGroupStopwatchAction = () => {
  const context = useContext(GroupStopwatchActionContext);
  if (!context) {
    throw new Error(
      'useGroupStopwatchAction must be used within GroupStopwatchProvider',
    );
  }
  return context;
};

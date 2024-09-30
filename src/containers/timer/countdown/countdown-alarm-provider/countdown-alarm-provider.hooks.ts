import { useContext } from 'react';
import {
  CountdownAlarmActionContext,
  CountdownAlarmStateContext,
} from './countdown-alarm-provider';

export const useCountdownAlarmState = () => {
  const value = useContext(CountdownAlarmStateContext);

  if (!value) {
    throw Error(
      'useCountdownAlarmState must be used within a CountdownAlarmProvider. Make sure that the component is wrapped in the CountdownAlarmProvider.',
    );
  }

  return value;
};

export const useCountdownAlarmAction = () => {
  const value = useContext(CountdownAlarmActionContext);

  if (!value) {
    throw Error(
      'useCountdownAlarmAction must be used within a CountdownAlarmProvider. Make sure that the component is wrapped in the CountdownAlarmProvider.',
    );
  }

  return value;
};

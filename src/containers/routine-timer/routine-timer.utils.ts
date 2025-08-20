import type { Activity } from './create-routine/routine-types';

export const getTotalTime = (activities: Activity[]): number =>
  activities.reduce((acc, activity) => acc + activity.time, 0);

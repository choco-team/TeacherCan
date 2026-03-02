export const ROUTINES_MAX_COUNT = 5 as const;
export const ACTIVITIES_MAX_COUNT = 10 as const;

export const HOUR_TO_SECONDS = 60 * 60;
export const MINUTE_TO_SECONDS = 60;

export const MAX_TIME_INPUT = {
  HOUR: 9,
  MINUTE: 59,
  SECOND: 59,
} as const;

export const MAX_TIME =
  MAX_TIME_INPUT.HOUR * HOUR_TO_SECONDS +
  MAX_TIME_INPUT.MINUTE * MINUTE_TO_SECONDS +
  MAX_TIME_INPUT.SECOND;

export const NO_TIME = 0;

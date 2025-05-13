export type Activity = {
  activityKey: string;
  order: number;
  action: string;
  time: number;
};

export type Routine = {
  key: string;
  title: string;
  totalTime: number;
  activities: Activity[];
};

export type RouteParams = {
  params: {
    id: string;
  };
};

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
  videoId: string;
  url?: string;
};

export type RouteParams = {
  params: {
    id: string;
  };
};

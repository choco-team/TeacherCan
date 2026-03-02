export type Activity = {
  id: string;
  order: number;
  action: string;
  time: number;
};

export type Routine = {
  id: string;
  title: string;
  activities: Activity[];
  totalTime: number;
  videoId?: string;
  videoTitle?: string;
};

export type RouteParams = {
  params?: { id: string };
};

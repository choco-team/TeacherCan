export type Activity = {
  order: number;
  action: string;
  time: number;
};

export type Routine = {
  key: string;
  title: string;
  totalTime: number;
  routine: Activity[];
};

export type RouteParams = {
  params: {
    id: string;
  };
};

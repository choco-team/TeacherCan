export interface PresentationStudent {
  id: number;
  nickname: string;
  fullName: string;
  count: number;
  decoration?: string;
}

export interface PresentationClassInfo {
  title: string;
  students: PresentationStudent[];
}

export interface SavedPresentation {
  id: string;
  title: string;
  students: PresentationStudent[];
  createdAt: string;
}

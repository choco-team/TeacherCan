export type Announcement = {
  id: string;
  title: string;
  date: string;
  coverImageUrl: string | null;
  tags: string[];
  summary: string;
};

export type Announcements = Announcement[];

export type Cover =
  | {
      type: 'external';
      external: {
        url: string;
      };
    }
  | {
      type: 'file';
      file: {
        url: string;
      };
    }
  | null
  | undefined;

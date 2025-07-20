export type Announcement = {
  id: string;
  title: string;
  date: string;
  coverImageUrl: string;
  tags: string[];
  summary: string;
};

export type Announcements = Announcement[];

import { Client } from '@notionhq/client';
import { Announcements } from './announcement-list.types';

const { NOTION_API_KEY } = process.env;
const { NOTION_RELEASE_NOTE_DATABASE_ID } = process.env;

const reshapeAnnouncementNote = (data: any): Announcements => {
  return data.map((item: any) => {
    const {
      properties: { tags, title, date, summary },
      cover,
    } = item;

    return {
      id: item.id,
      title: title.title[0].plain_text,
      summary: summary.rich_text[0].plain_text,
      date: date.date.start,
      coverImageUrl:
        cover.type === 'external'
          ? item.cover.external.url
          : item.cover.file.url,
      tags: tags.multi_select.map((tag: { name: string }) => tag.name),
    };
  });
};

export const getAnnouncementNote = async () => {
  const notion = new Client({ auth: NOTION_API_KEY });

  try {
    const response = await notion.databases.query({
      database_id: NOTION_RELEASE_NOTE_DATABASE_ID,
      page_size: 10,
      sorts: [
        {
          property: 'date',
          direction: 'descending',
        },
      ],
    });

    return {
      success: true,
      data: reshapeAnnouncementNote(response.results),
    };
  } catch (error) {
    return {
      success: false,
      data: null,
    };
  }
};

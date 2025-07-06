import { Client } from '@notionhq/client';

const { NOTION_API_KEY } = process.env;
const { NOTION_RELEASE_NOTE_DATABASE_ID } = process.env;

const reshapeReleaseNote = (
  data: any,
): {
  id: string;
  title: string;
  createdAt: string;
}[] => {
  return data.map((item: any) => ({
    id: item.id,
    title: item.properties.Title.title[0].plain_text,
    createdAt: item.created_time,
  }));
};

export const getReleaseNote = async () => {
  const notion = new Client({ auth: NOTION_API_KEY });

  try {
    const response = await notion.databases.query({
      database_id: NOTION_RELEASE_NOTE_DATABASE_ID,
      page_size: 10,
    });

    return {
      success: true,
      data: reshapeReleaseNote(response.results),
    };
  } catch (error) {
    return {
      success: false,
      data: null,
    };
  }
};

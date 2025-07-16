import { Client } from '@notionhq/client';

const { NOTION_API_KEY } = process.env;
const { NOTION_RELEASE_NOTE_DATABASE_ID } = process.env;

const reshapeReleaseNote = (
  data: any,
): {
  id: string;
  title: string;
  date: string;
  coverImageUrl: string;
}[] => {
  return data.map((item: any) => {
    return {
      id: item.id,
      title: item.properties.title.title[0].plain_text,
      date: item.properties.date.date.start,
      coverImageUrl:
        item.cover.type === 'external'
          ? item.cover.external.url
          : item.cover.file.url,
    };
  });
};

export const getReleaseNote = async () => {
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
      data: reshapeReleaseNote(response.results),
    };
  } catch (error) {
    return {
      success: false,
      data: null,
    };
  }
};

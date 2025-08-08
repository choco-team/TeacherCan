// eslint-disable-next-line import/no-extraneous-dependencies
import { NotionAPI } from 'notion-client';
import { Client } from '@notionhq/client';

export const notion = new NotionAPI();

const { NOTION_API_KEY } = process.env;

const notionClient = new Client({ auth: NOTION_API_KEY });

export const getAnnouncementNoteDetail = async (id: string) => {
  try {
    const [pageResponse, blocksResponse] = await Promise.all([
      notionClient.pages.retrieve({
        page_id: id,
      }),
      notionClient.blocks.children.list({
        block_id: id,
      }),
    ]);

    return {
      success: true,
      data: {
        page: pageResponse,
        blocks: blocksResponse.results,
      },
    };
  } catch (error) {
    console.error('Notion API Error:', error);
    return {
      success: false,
      data: null,
    };
  }
};

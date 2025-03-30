import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const { NOTION_API_KEY } = process.env;
const { NOTION_FEEDBACK_DATABASE_ID } = process.env;

export async function POST(request: Request) {
  const notion = new Client({ auth: NOTION_API_KEY });

  try {
    const body = (await request.json()) as {
      type: string;
      page: string;
      content: string;
    };
    const { type, page, content } = body;

    const pageEmojiByType = {
      버그: '🐛',
      개선: '⚒️',
      제안: '💡',
      응원: '💖',
      기타: '📝',
    };

    const title = `${page}에 ${type} 피드백이 들어왔습니다.`;

    const response = await notion.pages.create({
      parent: {
        type: 'database_id',
        database_id: NOTION_FEEDBACK_DATABASE_ID,
      },
      icon: {
        type: 'emoji',
        emoji: pageEmojiByType[type],
      },
      properties: {
        제목: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        유형: {
          select: {
            name: type,
          },
        },
        페이지: {
          select: {
            name: page,
          },
        },
        상태: {
          status: {
            name: '접수',
          },
        },
      },
      children: [
        {
          object: 'block',
          paragraph: {
            rich_text: [
              {
                text: {
                  content,
                },
              },
            ],
            color: 'default',
          },
        },
      ],
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error(error.code);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

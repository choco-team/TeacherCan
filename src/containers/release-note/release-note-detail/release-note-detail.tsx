import { getReleaseNoteDetail } from './release-note-detail.utils';

type Props = {
  id: string;
};

// 블록 렌더링 컴포넌트
function NotionBlockRenderer({ block }: { block: any }) {
  const { type } = block;

  // 텍스트 추출 함수 - 실제 Notion API 구조에 맞게 수정
  const getText = (blockData: any) => {
    // 각 블록 타입별로 다른 속성에서 텍스트를 가져옴
    switch (blockData.type) {
      case 'paragraph':
        return blockData.paragraph?.rich_text?.[0]?.plain_text || '';
      case 'heading_1':
        return blockData.heading_1?.rich_text?.[0]?.plain_text || '';
      case 'heading_2':
        return blockData.heading_2?.rich_text?.[0]?.plain_text || '';
      case 'heading_3':
        return blockData.heading_3?.rich_text?.[0]?.plain_text || '';
      case 'bulleted_list_item':
        return blockData.bulleted_list_item?.rich_text?.[0]?.plain_text || '';
      case 'numbered_list_item':
        return blockData.numbered_list_item?.rich_text?.[0]?.plain_text || '';
      case 'quote':
        return blockData.quote?.rich_text?.[0]?.plain_text || '';
      case 'code':
        return blockData.code?.rich_text?.[0]?.plain_text || '';
      default:
        return '';
    }
  };

  const text = getText(block);

  switch (type) {
    case 'paragraph':
      return text ? <p className="mb-4 text-gray-800">{text}</p> : null;

    case 'heading_1':
      return text ? (
        <h1 className="text-3xl font-bold mb-6 text-gray-900">{text}</h1>
      ) : null;

    case 'heading_2':
      return text ? (
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">{text}</h2>
      ) : null;

    case 'heading_3':
      return text ? (
        <h3 className="text-xl font-semibold mb-3 text-gray-900">{text}</h3>
      ) : null;

    case 'bulleted_list_item':
      return text ? (
        <li className="mb-2 text-gray-800 list-disc ml-4">{text}</li>
      ) : null;

    case 'numbered_list_item':
      return text ? (
        <li className="mb-2 text-gray-800 list-decimal ml-4">{text}</li>
      ) : null;

    case 'quote':
      return text ? (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 mb-4">
          {text}
        </blockquote>
      ) : null;

    case 'code':
      return text ? (
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
          <code className="text-sm text-gray-800">{text}</code>
        </pre>
      ) : null;

    case 'divider':
      return <hr className="my-6 border-gray-300" />;

    default:
      return text ? <div className="mb-4 text-gray-800">{text}</div> : null;
  }
}

export default async function ReleaseNoteDetail({ id }: Props) {
  const { data } = await getReleaseNoteDetail(id);

  // 페이지 제목 추출
  const getPageTitle = (page: any) => {
    if (page?.properties?.Title?.title?.[0]?.plain_text) {
      return page.properties.Title.title[0].plain_text;
    }
    if (page?.properties?.Name?.title?.[0]?.plain_text) {
      return page.properties.Name.title[0].plain_text;
    }
    return '';
  };

  // 페이지 생성일 추출
  const getPageCreatedTime = (page: any) => {
    if ('created_time' in page && page.created_time) {
      return page.created_time;
    }
    return null;
  };

  const pageTitle = getPageTitle(data.page);
  const pageCreatedTime = getPageCreatedTime(data.page);

  return (
    <div className="p-6 mx-auto max-w-screen-sm w-full">
      {pageTitle && (
        <h1 className="text-4xl font-bold mb-8 text-gray-900">{pageTitle}</h1>
      )}

      {/* 페이지 생성일 */}
      {pageCreatedTime && (
        <p className="text-sm text-gray-500 mb-8">
          {new Date(pageCreatedTime).toLocaleDateString('ko-KR')}
        </p>
      )}

      {/* 블록들 렌더링 */}
      <div className="space-y-4">
        {data.blocks.map((block: any) => (
          <div key={block.id}>
            <NotionBlockRenderer block={block} />
          </div>
        ))}
      </div>
    </div>
  );
}

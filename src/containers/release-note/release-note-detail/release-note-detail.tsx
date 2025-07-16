import { getReleaseNoteDetail } from './release-note-detail.utils';

type Props = {
  id: string;
};

function NotionBlockRenderer({ block }: { block: any }) {
  const { type } = block;

  const getText = (blockData: any) => {
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

  const getImageUrl = (blockData: any) => {
    if (blockData.type === 'image') {
      const imageData = blockData.image;
      if (imageData?.type === 'external') {
        return imageData.external?.url;
      }
      if (imageData?.type === 'file') {
        return imageData.file?.url;
      }
    }
    return null;
  };

  const getImageCaption = (blockData: any) => {
    if (blockData.type === 'image') {
      return blockData.image?.caption?.[0]?.plain_text || '';
    }
    return '';
  };

  const text = getText(block);
  const imageUrl = getImageUrl(block);
  const imageCaption = getImageCaption(block);

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

    case 'quote':
      return text ? (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 mb-4">
          {text}
        </blockquote>
      ) : null;

    case 'image':
      return imageUrl ? (
        <figure className="mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={imageCaption || 'Notion 이미지'}
            className="w-full h-auto rounded-lg shadow-md"
            loading="lazy"
          />
          {imageCaption && (
            <figcaption className="text-sm text-gray-600 text-center mt-2 italic">
              {imageCaption}
            </figcaption>
          )}
        </figure>
      ) : null;

    case 'divider':
      return <hr className="my-6 border-gray-300" />;

    default:
      return text ? <div className="mb-4 text-gray-800">{text}</div> : null;
  }
}

export default async function ReleaseNoteDetail({ id }: Props) {
  const { data } = await getReleaseNoteDetail(id);

  const getPageTitle = (page: any) => {
    if (page?.properties?.title?.title?.[0]?.plain_text) {
      return page.properties.title.title[0].plain_text;
    }

    return '';
  };

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

      {pageCreatedTime && (
        <p className="text-gray-700 mb-8">
          {new Date(pageCreatedTime).toLocaleDateString('ko-KR')}
        </p>
      )}

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

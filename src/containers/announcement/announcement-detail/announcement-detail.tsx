import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Badge } from '@/components/badge';
import { SparkleIcon } from 'lucide-react';
import { Heading1, Heading2, Heading3 } from '@/components/heading';
import { getAnnouncementNoteDetail } from './announcement-detail.utils';
import { ImageWithSkeleton } from './image-with-skeleton';

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
      return text ? <p className="mb-4 text-text-title">{text}</p> : null;

    case 'heading_1':
      return text ? <Heading1 className="mb-6 ">{text}</Heading1> : null;

    case 'heading_2':
      return text ? (
        <Heading2 className="mb-4  font-bold">{text}</Heading2>
      ) : null;

    case 'heading_3':
      return text ? (
        <Heading3 className="mb-3 font-bold">{text}</Heading3>
      ) : null;

    case 'bulleted_list_item':
      return text ? (
        <li className="mb-2 text-text-title list-disc ml-4">{text}</li>
      ) : null;

    case 'quote':
      return text ? (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-text-title mb-4">
          {text}
        </blockquote>
      ) : null;

    case 'image':
      return imageUrl ? (
        <ImageWithSkeleton
          src={imageUrl}
          alt={imageCaption || 'Notion 이미지'}
          caption={imageCaption}
        />
      ) : null;

    case 'divider':
      return <hr className="my-6 border-gray-300" />;

    default:
      return text ? <div className="mb-4 text-gray-800">{text}</div> : null;
  }
}

export default async function AnnouncementDetail({ id }: Props) {
  const { data } = await getAnnouncementNoteDetail(id);

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

  const getPageTags = (page: any) => {
    if (page?.properties?.tags?.multi_select) {
      return page.properties.tags.multi_select.map((tag: any) => tag.name);
    }
    return [];
  };

  const getPageSummary = (page: any) => {
    if (page?.properties?.summary?.rich_text?.[0]?.plain_text) {
      return page.properties.summary.rich_text[0].plain_text;
    }
    return '';
  };

  const pageTitle = getPageTitle(data.page);
  const pageCreatedTime = getPageCreatedTime(data.page);
  const pageTags = getPageTags(data.page);
  const pageSummary = getPageSummary(data.page);

  return (
    <div className="p-6 mx-auto max-w-screen-sm w-full">
      {pageTitle && (
        <h1 className="text-4xl font-bold mb-2 text-text-title">{pageTitle}</h1>
      )}

      {pageTags.length > 0 && (
        <div className="flex gap-x-2 mb-6">
          {pageTags.map((tag) => (
            <Badge key={tag} variant="gray" size="sm">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {pageCreatedTime && (
        <p className="text-gray-500 mb-8">
          {format(new Date(pageCreatedTime), 'yy년 MMM dd일 iiii', {
            locale: ko,
          })}
        </p>
      )}

      {pageSummary && (
        <div className="text-text-title mb-8 flex flex-col gap-y-2">
          <Badge variant="secondary-outline" size="sm" className="w-fit">
            AI 요약 <SparkleIcon className="size-3" />
          </Badge>
          <span>{pageSummary}</span>
        </div>
      )}

      <hr className="my-6 border-gray-300" />

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

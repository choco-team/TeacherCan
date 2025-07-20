import { Heading1 } from '@/components/heading';
import ReleaseNoteItem from './announcement-item/announcement-item';
import { getAnnouncementNote } from './announcement-list.utils';

export default async function AnnouncementNoteList() {
  const { success, data } = await getAnnouncementNote();

  if (!success) {
    return <div>데이터를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div className="flex flex-col gap-y-10 mx-auto max-w-screen-sm w-full">
      <Heading1>티처캔의 새로운 소식을 전해드려요.</Heading1>
      <div className="flex flex-col gap-12">
        {data?.map((item) => <ReleaseNoteItem key={item.id} {...item} />)}
      </div>
    </div>
  );
}

import { Heading1 } from '@/components/heading';
import AnnouncementNoteItem from './announcement-item/announcement-item';
import { getAnnouncementNote } from './announcement-list.utils';
import AnnouncementMoreButton from './announcemnet-more-button/announcemnet-more-button';

export default async function AnnouncementNoteList() {
  const { success, data } = await getAnnouncementNote();

  if (!success) {
    // TODO:(김홍동) 공지사항 목록에 버그가 있는 경우 UI/UX대응
    return (
      <div className="flex flex-col gap-y-6 mx-auto max-w-screen-sm w-full mb-10">
        <div className="text-center py-12">
          <div className="text-gray-500">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="text-lg font-medium text-text-title mb-2">
              공지사항을 불러올 수 없습니다
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              잠시 후 페이지를 새로고침해주세요.
            </p>
            <p className="text-xs text-gray-500">
              계속 문제가 발생한다면{' '}
              <a href="/feedback" className="text-blue-600 hover:underline">
                피드백
              </a>
              을 통해 알려주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-10 mx-auto max-w-screen-sm w-full mb-10">
      <Heading1>티처캔의 새로운 소식을 전해드려요.</Heading1>
      <div className="flex flex-col gap-16">
        {data?.map((item) => <AnnouncementNoteItem key={item.id} {...item} />)}
      </div>
      <AnnouncementMoreButton />
    </div>
  );
}

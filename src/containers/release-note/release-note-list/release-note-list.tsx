import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import Image from 'next/image';
import { getReleaseNote } from './release-note-list.utils';

export default async function ReleaseNoteList() {
  const { success, data } = await getReleaseNote();

  if (!success) {
    return <div>데이터를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div className="p-6 mx-auto max-w-screen-sm w-full">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">릴리즈 노트</h1>
      <div className="flex flex-col gap-5">
        {data?.map((item) => (
          <Link key={item.id} href={`/release-note/${item.id}`}>
            <div className="relative w-full aspect-video rounded-sm">
              <Image
                src={item.coverImageUrl}
                alt={item.title}
                fill
                className="object-cover rounded-sm"
              />
            </div>
            {item.title}
            {format(new Date(item.date), 'yy년 MMM dd일 iiii', {
              locale: ko,
            })}
            <button type="button">자세히 보기</button>
          </Link>
        ))}
      </div>
    </div>
  );
}

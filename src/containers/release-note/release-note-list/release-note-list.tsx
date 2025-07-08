import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import { getReleaseNote } from './release-note-list.utils';

export default async function ReleaseNoteList() {
  const { success, data } = await getReleaseNote();

  if (!success) {
    return <div>데이터를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div>
      {data?.map((item) => (
        <div key={item.id}>
          {item.title}
          {format(new Date(item.createdAt), 'yy년 MMM dd일 iiii', {
            locale: ko,
          })}
          <Link href={`/release-note/${item.id}`}>
            <button type="button">자세히 보기</button>
          </Link>
        </div>
      ))}
    </div>
  );
}

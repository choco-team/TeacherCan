import ReleaseNoteItem from './release-note-item/release-note-item';
import { getReleaseNote } from './release-note-list.utils';

export default async function ReleaseNoteList() {
  const { success, data } = await getReleaseNote();

  if (!success) {
    return <div>데이터를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div className="p-6 mx-auto max-w-screen-sm w-full">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">릴리즈 노트</h1>
      <div className="flex flex-col gap-12">
        {data?.map((item) => <ReleaseNoteItem key={item.id} {...item} />)}
      </div>
    </div>
  );
}

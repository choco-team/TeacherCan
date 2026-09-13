import { formatInTimeZone } from 'date-fns-tz';
import { Heading1 } from '@/components/heading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';
import { supabaseAdmin } from '@/utils/supabase-admin';
import DeleteRoomButton from './delete-room-button';
import SortableHead, { parseDirection, parseSort } from './sortable-head';

/** PostgREST 기본 상한. 이 수만큼 왔다면 뒤가 잘렸을 수 있다. */
const MAX_ROWS = 1000;

type AdminRoom = {
  id: string;
  roomTitle: string;
  connectedAt: string;
  lastActivityAt: string;
  musics: { id: number; title: string; studentName: string }[];
};

const formatKst = (value: string) =>
  formatInTimeZone(new Date(value), 'Asia/Seoul', 'yyyy-MM-dd HH:mm');

const getStudentNames = (musics: AdminRoom['musics']) =>
  Array.from(new Set(musics.map((music) => music.studentName)));

const getDaysAgo = (value: string) =>
  Math.floor((Date.now() - new Date(value).getTime()) / (24 * 60 * 60 * 1000));

type Props = {
  searchParams: {
    sort?: string;
    dir?: string;
  };
};

export default async function AdminMusicRequestContainer({
  searchParams,
}: Props) {
  const sort = parseSort(searchParams.sort);
  const direction = parseDirection(searchParams.dir);

  if (!supabaseAdmin) {
    return (
      <div className="flex flex-col gap-y-4">
        <Heading1>음악신청 관리</Heading1>
        <p className="text-sm text-gray-500 whitespace-pre-line">
          {
            'SUPABASE_SERVICE_ROLE_KEY 가 설정되지 않았습니다.\n.env.local 에 추가한 뒤 개발 서버를 다시 시작해주세요.'
          }
        </p>
      </div>
    );
  }

  // 정렬은 반드시 DB 에서 해야 한다. 응답이 MAX_ROWS 로 잘리므로,
  // 가져온 뒤 JS 에서 정렬하면 잘린 바깥쪽 행을 영영 볼 수 없다.
  const { data, error } = await supabaseAdmin
    .from('rooms')
    .select(
      'id, roomTitle, connectedAt, lastActivityAt, musics(id, title, studentName)',
    )
    .order(sort, { ascending: direction === 'asc' });

  if (error) {
    return (
      <div className="flex flex-col gap-y-4">
        <Heading1>음악신청 관리</Heading1>
        <p className="text-sm text-red">조회에 실패했습니다: {error.message}</p>
      </div>
    );
  }

  const rooms = (data ?? []) as AdminRoom[];

  const totalMusicCount = rooms.reduce(
    (sum, room) => sum + room.musics.length,
    0,
  );

  return (
    <div className="flex flex-col gap-y-6">
      <Heading1>음악신청 관리</Heading1>

      <div className="flex flex-col gap-1">
        <p className="text-sm text-gray-500">
          방 {rooms.length}개 · 신청곡 {totalMusicCount}곡
        </p>
        {rooms.length >= MAX_ROWS && (
          <p className="text-sm text-red">
            {MAX_ROWS}개까지만 조회됩니다. 정렬을 바꿔 반대쪽을 확인하세요.
          </p>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <SortableHead
              label="방 제목"
              sortKey="roomTitle"
              activeSort={sort}
              activeDirection={direction}
              className="w-[20%]"
            />
            <SortableHead
              label="방 ID"
              sortKey="id"
              activeSort={sort}
              activeDirection={direction}
              className="w-[10%]"
            />
            <SortableHead
              label="생성"
              sortKey="connectedAt"
              activeSort={sort}
              activeDirection={direction}
              className="w-[14%]"
            />
            <SortableHead
              label="마지막 활동"
              sortKey="lastActivityAt"
              activeSort={sort}
              activeDirection={direction}
              className="w-[16%]"
            />
            <TableHead className="w-[6%]">곡</TableHead>
            <TableHead className="w-[26%]">학생</TableHead>
            <TableHead className="w-[8%]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map((room) => {
            const studentNames = getStudentNames(room.musics);

            return (
              <TableRow key={room.id}>
                <TableCell className="truncate">{room.roomTitle}</TableCell>
                <TableCell className="font-mono text-xs text-gray-500">
                  {room.id.slice(0, 8)}
                </TableCell>
                <TableCell className="text-xs text-gray-500">
                  {formatKst(room.connectedAt)}
                </TableCell>
                <TableCell className="text-xs text-gray-500">
                  {formatKst(room.lastActivityAt)}
                  <span className="block text-gray-400">
                    {getDaysAgo(room.lastActivityAt)}일 전
                  </span>
                </TableCell>
                <TableCell>{room.musics.length}</TableCell>
                <TableCell className="truncate text-xs text-gray-500">
                  {studentNames.join(', ') || '-'}
                </TableCell>
                <TableCell>
                  <DeleteRoomButton
                    roomId={room.id}
                    roomTitle={room.roomTitle}
                    musicCount={room.musics.length}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {rooms.length === 0 && (
        <p className="text-sm text-gray-500">방이 없습니다.</p>
      )}
    </div>
  );
}

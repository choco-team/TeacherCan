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

type AdminRoom = {
  id: string;
  roomTitle: string;
  connectedAt: string;
  musics: { id: number; title: string; studentName: string }[];
};

const formatKst = (value: string) =>
  formatInTimeZone(new Date(value), 'Asia/Seoul', 'yyyy-MM-dd HH:mm');

const getStudentNames = (musics: AdminRoom['musics']) =>
  Array.from(new Set(musics.map((music) => music.studentName)));

export default async function AdminMusicRequestContainer() {
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

  const { data, error } = await supabaseAdmin
    .from('rooms')
    .select('id, roomTitle, connectedAt, musics(id, title, studentName)')
    .order('connectedAt', { ascending: false });

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

      <p className="text-sm text-gray-500">
        방 {rooms.length}개 · 신청곡 {totalMusicCount}곡
      </p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[22%]">방 제목</TableHead>
            <TableHead className="w-[14%]">방 ID</TableHead>
            <TableHead className="w-[14%]">생성</TableHead>
            <TableHead className="w-[8%]">곡</TableHead>
            <TableHead className="w-[34%]">학생</TableHead>
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

import { supabase } from '@/utils/supabase';
import { saveMusicRoom } from './music-room-storage';

// 입력 UI 에서 쓰는 길이 제한.
// 실제 강제는 add_music 함수와 musics_student_name_length 제약이 하므로 셋을 함께 맞춰야 한다.
export const MAX_STUDENT_NAME_LENGTH = 20;

function generateSecretToken(): string {
  return crypto.randomUUID();
}

// ─── Types ───

export type YoutubeVideo = {
  id: number;
  musicId: string;
  title: string;
  studentName: string;
  timeStamp: string;
};

export type GetMusicRequestRoomResponse = {
  roomTitle: string;
  musicList: YoutubeVideo[];
};

type CreateMusicRequestRoomResponse = { roomId: string };
type GetMusicRequestRoomTitleResponse = { roomTitle: string };

// ─── API 함수들 (Supabase 직접 호출) ───

/**
 * 방 생성 — RPC 함수(create_room)를 통해 rooms + room_secrets를 트랜잭션으로 원자적 생성
 * 생성된 secret_token은 localStorage에 저장
 */
export const createMusicRequestRoom = async (params: {
  roomTitle: string;
}): Promise<CreateMusicRequestRoomResponse> => {
  const secretToken = generateSecretToken();

  const { data, error } = await supabase.rpc('create_room', {
    p_room_title: params.roomTitle,
    p_secret_token: secretToken,
  });

  if (error) {
    throw new Error(error.message);
  }

  const roomId = data as string;

  // 방 개설자 토큰을 보관한다. 이 토큰이 곧 교사의 방 목록이 된다.
  saveMusicRoom(roomId, secretToken);

  return { roomId };
};

/**
 * 방 제목 조회
 */
export const getMusicRequestRoomTitle = async (params: {
  roomId: string;
}): Promise<GetMusicRequestRoomTitleResponse> => {
  const { data, error } = await supabase.rpc('get_room_title', {
    p_room_id: params.roomId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { roomTitle: data as string };
};

/**
 * 음악 추가 — RPC 함수(add_music)를 통해 서버 측에서 검증 후 INSERT
 * 방 존재 여부 / 유튜브 ID 형식 / 이름 다듬기 / 중복 / 방 곡수 상한을 함수가 처리하고,
 * 위반 시 사용자에게 보여줄 문구를 그대로 에러 메시지로 던진다.
 */
export const createMusicRequestMusic = async (params: {
  roomId: string;
  student: string;
  musicId: string;
  title: string;
}): Promise<void> => {
  const { error } = await supabase.rpc('add_music', {
    p_room_id: params.roomId,
    p_music_id: params.musicId,
    p_title: params.title,
    p_student: params.student,
  });

  if (error) {
    throw new Error(error.message);
  }
};

/**
 * 방 삭제 — musics, room_secrets, room_members 는 FK 의 ON DELETE CASCADE 로 함께 정리된다.
 *
 * rooms_delete 정책이 room_members 소속 여부를 확인하므로, 소유자가 아니면
 * 에러 없이 0건이 삭제된다. 그 경우를 구분하려고 삭제된 행을 돌려받아 확인한다.
 */
export const deleteMusicRequestRoom = async (params: {
  roomId: string;
}): Promise<void> => {
  const { data, error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', params.roomId)
    .select('id');

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error(
      '방을 삭제할 권한이 없어요. 방을 만든 기기에서 시도해주세요.',
    );
  }
};

/**
 * 방 정보 + 음악 목록 조회 (외래키 조인으로 단일 쿼리)
 */
export const getMusicRequestRoom = async (params: {
  roomId: string;
}): Promise<GetMusicRequestRoomResponse> => {
  const { data, error } = await supabase
    .from('rooms')
    .select('roomTitle, musics(*)')
    .eq('id', params.roomId)
    .order('timeStamp', { ascending: true, referencedTable: 'musics' })
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    roomTitle: data.roomTitle,
    musicList: (data.musics ?? []) as YoutubeVideo[],
  };
};

/**
 * 음악 삭제 — musics_delete 정책이 room_members 소속 여부를 확인한다.
 *
 * 소유자가 아니면 에러 없이 0건이 삭제되므로, 방 삭제와 마찬가지로
 * 삭제된 행을 돌려받아 구분한다.
 */
export const deleteMusicRequestMusic = async (params: {
  roomId: string;
  musicId: string;
}): Promise<void> => {
  const { data, error } = await supabase
    .from('musics')
    .delete()
    .eq('roomId', params.roomId)
    .eq('musicId', params.musicId)
    .select('id');

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error(
      '곡을 삭제할 권한이 없어요. 방을 만든 기기에서 시도해주세요.',
    );
  }
};

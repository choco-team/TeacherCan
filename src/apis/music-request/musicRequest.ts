import { supabase } from '@/utils/supabase';

// ─── secret_token 유틸 (방 개설자 인증용) ───

const SECRET_TOKEN_PREFIX = 'music-room-secret-';

function generateSecretToken(): string {
  return crypto.randomUUID();
}

function saveSecretToken(roomId: string, token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`${SECRET_TOKEN_PREFIX}${roomId}`, token);
  }
}

export function getSecretToken(roomId: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(`${SECRET_TOKEN_PREFIX}${roomId}`);
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
type CreateMusicRequestMusicResponse = {
  musicId: string;
  roomId: string;
  studentId: number;
  title: string;
  id: number;
  timeStamp: string;
};

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

  // 방 개설자 토큰을 localStorage에 저장
  saveSecretToken(roomId, secretToken);

  return { roomId };
};

/**
 * 방 제목 조회
 */
export const getMusicRequestRoomTitle = async (params: {
  roomId: string;
}): Promise<GetMusicRequestRoomTitleResponse> => {
  const { data, error } = await supabase
    .from('rooms')
    .select('roomTitle')
    .eq('id', params.roomId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { roomTitle: data.roomTitle };
};

/**
 * 음악 추가 — musics 테이블에 INSERT (중복 체크 포함)
 */
export const createMusicRequestMusic = async (params: {
  roomId: string;
  student: string;
  musicId: string;
  title: string;
}): Promise<CreateMusicRequestMusicResponse> => {
  // 중복 체크
  const { data: existing } = await supabase
    .from('musics')
    .select('id')
    .eq('roomId', params.roomId)
    .eq('musicId', params.musicId)
    .maybeSingle();

  if (existing) {
    throw new Error('이미 신청된 음악입니다.');
  }

  const { data, error } = await supabase
    .from('musics')
    .insert({
      musicId: params.musicId,
      title: params.title,
      roomId: params.roomId,
      studentName: params.student,
      timeStamp: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as CreateMusicRequestMusicResponse;
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
 * 음악 삭제 — RPC 함수(delete_music)를 통해 서버 측에서 토큰 검증 후 삭제
 * 클라이언트에서 musics 테이블에 직접 DELETE를 날리지 않음
 */
export const DeleteMusicRequestMusic = async (params: {
  roomId: string;
  musicId: string;
}): Promise<{}> => {
  const secretToken = getSecretToken(params.roomId);

  if (!secretToken) {
    throw new Error('삭제 권한이 없습니다. (방 개설자만 삭제 가능)');
  }

  const { error } = await supabase.rpc('delete_music', {
    p_room_id: params.roomId,
    p_music_id: params.musicId,
    p_secret_token: secretToken,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {};
};

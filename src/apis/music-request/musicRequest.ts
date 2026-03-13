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
 * 방 생성
 * - rooms 테이블: 공개 정보만 INSERT (id, roomTitle, connectedAt)
 * - room_secrets 테이블: roomId + secret_token 짝지어 INSERT
 * - localStorage: 방 개설자 브라우저에 토큰 저장
 */
export const createMusicRequestRoom = async (params: {
  roomTitle: string;
}): Promise<CreateMusicRequestRoomResponse> => {
  const roomId = crypto.randomUUID();
  const secretToken = generateSecretToken();

  // 1) rooms 테이블 — 공개 정보만
  const { error: roomError } = await supabase
    .from('rooms')
    .insert({
      id: roomId,
      roomTitle: params.roomTitle,
      connectedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (roomError) {
    throw new Error(roomError.message);
  }

  // 2) room_secrets 테이블 — 토큰 은닉 저장
  const { error: secretError } = await supabase.from('room_secrets').insert({
    room_id: roomId,
    secret_token: secretToken,
  });

  if (secretError) {
    // rooms는 이미 생성됐으므로 롤백 시도
    await supabase.from('rooms').delete().eq('id', roomId);
    throw new Error(secretError.message);
  }

  // 3) 방 개설자 토큰을 localStorage에 저장
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
 * 학생 등록 (현재 별도 students 테이블이 없으므로 no-op)
 */
export const createMusicRequestStudent = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _params: {
    roomId: string;
    name: string;
  },
): Promise<void> => {
  // 기존 백엔드에서도 별도 처리 로직이 없었으므로 no-op
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
 * 방 정보 + 음악 목록 조회
 */
export const getMusicRequestRoom = async (params: {
  roomId: string;
}): Promise<GetMusicRequestRoomResponse> => {
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('roomTitle')
    .eq('id', params.roomId)
    .single();

  if (roomError) {
    throw new Error(roomError.message);
  }

  const { data: musicList, error: musicError } = await supabase
    .from('musics')
    .select('*')
    .eq('roomId', params.roomId)
    .order('timeStamp', { ascending: true });

  if (musicError) {
    throw new Error(musicError.message);
  }

  // musicId 중복 제거 — 가장 최근 것만 유지
  const uniqueMusic = new Map<string, YoutubeVideo>();
  (musicList ?? []).forEach((music) => {
    if (
      !uniqueMusic.has(music.musicId) ||
      new Date(music.timeStamp) >
        new Date(uniqueMusic.get(music.musicId)!.timeStamp)
    ) {
      uniqueMusic.set(music.musicId, music as YoutubeVideo);
    }
  });

  const result = Array.from(uniqueMusic.values()).sort(
    (a, b) => new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime(),
  );

  return {
    roomTitle: room.roomTitle,
    musicList: result,
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

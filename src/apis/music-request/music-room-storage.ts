import { useCallback, useEffect, useState } from 'react';

/**
 * 교사가 만든 음악신청 방의 secret_token 보관소.
 *
 * 이 토큰이 방 소유권의 유일한 증명이고, 목록에 표시할 방도 여기서 나온다.
 * (예전에는 표시용 `roomIds` 배열과 방별 토큰 키가 따로 있어 서로 어긋날 수 있었다.)
 */

const STORAGE_KEY = 'music-rooms';

/** 예전 방식: 방마다 별도 키에 토큰을 저장했다 */
const LEGACY_TOKEN_PREFIX = 'music-room-secret-';

/** roomId → secret_token */
export type MusicRooms = Record<string, string>;

const parse = (raw: string | null): MusicRooms => {
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
};

/**
 * 레거시 키에 있는 방을 흡수하고 원본은 지운다.
 *
 * 한 번만 옮기지 않고 읽을 때마다 확인하는 이유는, 배포 직후 구버전 탭에서 만든 방이
 * 유실되는 창을 없애기 위해서다.
 *
 * 흡수한 뒤 레거시 키를 지우는 것이 중요하다. 남겨두면 출처가 둘이 되어,
 * 로컬 데이터 관리 페이지에서 music-rooms 를 지워도 다음 읽기에서 되살아난다.
 */
const absorbLegacy = (rooms: MusicRooms) => {
  const merged = { ...rooms };
  let hasChange = false;

  Object.keys(window.localStorage).forEach((key) => {
    if (!key.startsWith(LEGACY_TOKEN_PREFIX)) {
      return;
    }

    const roomId = key.slice(LEGACY_TOKEN_PREFIX.length);
    const token = window.localStorage.getItem(key);

    if (roomId && token && !merged[roomId]) {
      merged[roomId] = token;
    }

    window.localStorage.removeItem(key);
    hasChange = true;
  });

  return { merged, hasChange };
};

const read = (): MusicRooms => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const stored = parse(window.localStorage.getItem(STORAGE_KEY));
    const { merged, hasChange } = absorbLegacy(stored);

    if (hasChange) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    }

    return merged;
  } catch (error) {
    console.error(error);
    return {};
  }
};

const write = (rooms: MusicRooms) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
  } catch (error) {
    console.error(error);
  }
};

export const getMusicRooms = () => read();

export const saveMusicRoom = (roomId: string, token: string) => {
  write({ ...read(), [roomId]: token });
};

export const removeMusicRoom = (roomId: string) => {
  // read() 가 레거시 키를 이미 흡수·정리하므로 여기서는 맵만 다루면 된다
  const rooms = read();
  delete rooms[roomId];
  write(rooms);
};

/**
 * 목록 화면용 훅.
 *
 * localStorage 는 서버에서 읽을 수 없어 첫 렌더에는 값이 없다.
 * "아직 못 읽음(isLoaded false)" 과 "읽었는데 방이 없음(roomIds 빈 배열)" 을 구분해야
 * 로딩 표시와 빈 목록 안내를 올바르게 나눌 수 있다.
 */
export const useMusicRooms = () => {
  const [rooms, setRooms] = useState<MusicRooms>({});
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    setRooms(read());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const removeRoom = useCallback((roomId: string) => {
    removeMusicRoom(roomId);
    setRooms(read());
  }, []);

  return { roomIds: Object.keys(rooms), isLoaded, refresh, removeRoom };
};

import Cookies from 'js-cookie';

/**
 * 학생이 방에 입장할 때 입력한 이름 보관소.
 *
 * 예전에는 roomId 를 키로 하는 쿠키에 저장했다. 쿠키는 모든 HTTP 요청에 자동으로
 * 첨부되는데 서버가 이 값을 쓰지 않으므로 불필요한 전송이었고, 방마다 쿠키가
 * 하나씩 쌓여 도메인 쿠키 용량을 잠식했다. 미성년자 이름이라 더 신경 쓸 만하다.
 *
 * 쿠키의 1일 만료는 유지한다. 학교 공용 기기에서 앞 학생의 이름이 계속 남아 있으면
 * 안 되기 때문이다. localStorage 에는 만료가 없으므로 값에 시각을 담아 직접 관리한다.
 */

const STORAGE_KEY = 'music-request-students';

const EXPIRES_IN_MS = 24 * 60 * 60 * 1000;

type StudentEntry = {
  name: string;
  /** epoch milliseconds */
  expiresAt: number;
};

/** roomId → 입력한 이름 */
type StudentNames = Record<string, StudentEntry>;

const parse = (raw: string | null): StudentNames => {
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

const write = (names: StudentNames) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
  } catch (error) {
    console.error(error);
  }
};

/**
 * 만료된 항목을 걷어내고, 예전 쿠키에 남아 있는 이름을 흡수한다.
 *
 * 쿠키는 1일이면 스스로 사라지지만, 그 사이 수업 중인 학생이 이름을 다시 입력하게
 * 되는 것을 막기 위해 옮겨온다. 흡수한 쿠키는 지운다.
 */
const read = (roomId: string): StudentNames => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const stored = parse(window.localStorage.getItem(STORAGE_KEY));
    const now = Date.now();

    const alive = Object.fromEntries(
      Object.entries(stored).filter(([, entry]) => entry?.expiresAt > now),
    );

    let hasChange = Object.keys(alive).length !== Object.keys(stored).length;

    const legacyName = Cookies.get(roomId);

    if (legacyName && !alive[roomId]) {
      alive[roomId] = { name: legacyName, expiresAt: now + EXPIRES_IN_MS };
      hasChange = true;
    }

    if (legacyName) {
      Cookies.remove(roomId);
    }

    if (hasChange) {
      write(alive);
    }

    return alive;
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const getStudentName = (roomId: string) =>
  read(roomId)[roomId]?.name ?? '';

export const saveStudentName = (roomId: string, name: string) => {
  write({
    ...read(roomId),
    [roomId]: { name, expiresAt: Date.now() + EXPIRES_IN_MS },
  });
};

export const clearStudentName = (roomId: string) => {
  const names = read(roomId);
  delete names[roomId];
  write(names);
};

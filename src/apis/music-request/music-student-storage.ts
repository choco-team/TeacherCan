import Cookies from 'js-cookie';

/**
 * 학생이 방에 입장할 때 입력한 이름 보관소.
 *
 * sessionStorage 를 쓴다. 탭을 닫으면 사라지고 새로고침에는 살아남는데, 학생에게
 * 필요한 보존 범위가 딱 그만큼이다. 학교 공용 기기에서 앞 학생의 이름이 남지 않고,
 * 교사가 관리할 데이터도 아니게 된다.
 *
 * 예전에는 쿠키(1일), 그다음에는 localStorage(만료 시각 직접 관리)를 썼다.
 * 쿠키는 서버가 쓰지도 않는 값이 모든 요청에 첨부되는 문제가 있었고,
 * localStorage 는 탭을 닫아도 남아 만료 처리를 직접 해야 했다.
 * 탭 수명을 그대로 보관 정책으로 삼으면 그 코드가 전부 사라진다.
 */

const STORAGE_KEY = 'music-request-students';

/** roomId → 입력한 이름 */
type StudentNames = Record<string, string>;

const parse = (raw: string | null): Record<string, unknown> => {
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
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(names));
  } catch (error) {
    console.error(error);
  }
};

/**
 * 예전 저장소에 남은 이름을 흡수하고 원본을 지운다.
 *
 * localStorage 쪽은 데이터 관리 페이지에서도 항목을 뺐기 때문에, 여기서 치우지 않으면
 * 사용자가 지울 방법이 없는 데이터로 남는다.
 */
const absorbLegacy = (names: StudentNames, roomId: string) => {
  const merged = { ...names };
  let hasChange = false;

  const legacyLocal = parse(window.localStorage.getItem(STORAGE_KEY));

  Object.entries(legacyLocal).forEach(([key, entry]) => {
    const name = (entry as { name?: string })?.name;

    if (name && !merged[key]) {
      merged[key] = name;
      hasChange = true;
    }
  });

  if (Object.keys(legacyLocal).length > 0) {
    window.localStorage.removeItem(STORAGE_KEY);
    hasChange = true;
  }

  const legacyCookie = Cookies.get(roomId);

  if (legacyCookie) {
    if (!merged[roomId]) {
      merged[roomId] = legacyCookie;
    }

    Cookies.remove(roomId);
    hasChange = true;
  }

  return { merged, hasChange };
};

const read = (roomId: string): StudentNames => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const stored = parse(
      window.sessionStorage.getItem(STORAGE_KEY),
    ) as StudentNames;
    const { merged, hasChange } = absorbLegacy(stored, roomId);

    if (hasChange) {
      write(merged);
    }

    return merged;
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const getStudentName = (roomId: string) => read(roomId)[roomId] ?? '';

export const saveStudentName = (roomId: string, name: string) => {
  write({ ...read(roomId), [roomId]: name });
};

export const clearStudentName = (roomId: string) => {
  const names = read(roomId);
  delete names[roomId];
  write(names);
};

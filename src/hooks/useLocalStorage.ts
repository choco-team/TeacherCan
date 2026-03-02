import { useEffect, useState } from 'react';

type LocalStorageKey =
  | 'timer-alarm-sound'
  | 'qrcodes'
  | 'schedule'
  | 'recently-visited'
  | 'selectedSchool'
  | 'allergies'
  | 'routines'
  | 'roomIds'
  | 'random-pick-list'
  | 'student-data'
  | 'stopwatch-data'
  | 'stopwatch-group-grid-columns'
  | 'random-team-settings'
  | 'random-team-auto-run'
  | 'clock-memos'
  | 'clock-memo';

/**
 * @description 페이지 새로 고침을 통해 상태가 유지되도록 로컬 저장소에 동기화합니다.
 *
 * @param key 로컬 저장소에 저장될 키
 * @param initialValue 초기 값
 * @returns [storedValue, setValue] - 로컬 저장소에 저장된 값, 저장 함수
 */
function useLocalStorage<T>(key: LocalStorageKey, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.error(error);
    }
    // key만 의존성으로 두어 initialValue 객체 참조 변경 시 불필요한 재실행 방지
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;

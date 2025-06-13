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
  | 'shouldShowMusicListErrorPopup'
  | 'random-pick-list';

/**
 * @description 페이지 새로 고침을 통해 상태가 유지되도록 로컬 저장소에 동기화합니다.
 *
 * @param key 로컬 저장소에 저장될 키
 * @param initialValue 초기 값
 * @returns [storedValue, setValue] - 로컬 저장소에 저장된 값, 저장 함수
 */
function useLocalStorage<T>(key: LocalStorageKey, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);

      return initialValue;
    }
  });

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

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return [null, setValue] as const;
  }

  if (hasMounted) {
    return [storedValue, setValue] as const;
  }

  return [initialValue, setValue] as const;
}

export default useLocalStorage;

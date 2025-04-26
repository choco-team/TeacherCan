export const getCookieValue = <T>(name: string) => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!('cookieStore' in window)) {
    return null;
  }

  const cookie = window.cookieStore.get(name);
  if (!cookie) {
    return null;
  }

  return cookie.value as T;
};

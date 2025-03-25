import { useAuthStore } from '@/store/use-auth-store';

export const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export async function fetchWithAuth(endpoint: string, init: RequestInit = {}) {
  const requestInit: RequestInit = { ...init };

  requestInit.credentials = 'include';

  // headers를 적절히 처리
  const headers = new Headers(requestInit.headers || {});

  const { csrfToken } = useAuthStore.getState();
  if (csrfToken) {
    headers.set('X-CSRF-Token', csrfToken);
  }

  // 수정된 headers를 requestInit에 설정
  requestInit.headers = headers;

  const response = await fetch(API_URL + endpoint, requestInit);

  const newToken = response.headers.get('X-CSRF-Token');
  if (newToken) {
    useAuthStore.getState().setCsrf(newToken);
  }

  return response;
}

import { useAuthStore } from '@/store/use-auth-store';

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// NOTE:(김홍동) 토근 가져오는 임시 로직
const tempGetCsrfToken = async () => {
  const response = await fetch(`${BASE_URL}/login`, {
    credentials: 'include',
  });

  const csrfToken = response.headers.get('X-CSRF-Token');
  useAuthStore.setState({ csrfToken });

  return csrfToken;
};

export const fetcher = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const { csrfToken } = useAuthStore.getState();

  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken ?? (await tempGetCsrfToken()),
    },
    credentials: 'include',
    ...options,
  });

  const text = await response.text();

  if (!response.ok) {
    const errorMessage = JSON.parse(text)?.message ?? 'Failed to fetch';

    throw new Error(errorMessage);
  }

  const newCsrfToken = response.headers.get('X-CSRF-Token');
  useAuthStore.setState({ csrfToken: newCsrfToken });

  return text ? JSON.parse(text) : ({} as T);
};

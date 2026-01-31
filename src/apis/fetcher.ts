const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const fetcher = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    ...options,
  });

  const text = await response.text();

  if (!response.ok) {
    const errorMessage = JSON.parse(text)?.message ?? 'Failed to fetch';

    throw new Error(errorMessage);
  }

  return text ? JSON.parse(text) : ({} as T);
};

import { headers } from 'next/headers';

export const getDomainURL = () => {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';

  return `${protocol}://${host}`;
};

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            refetchOnMount: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default QueryProvider;

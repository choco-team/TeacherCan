'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient()); // CSR에서 유지되도록 useState 사용

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default QueryProvider;

'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

function makeQueryClient() {
   return new QueryClient({
      defaultOptions: {
         queries: {
            staleTime: 60 * 1000, // 1 minute — prevents refetch on every mount
            gcTime: 5 * 60 * 1000, // 5 minutes — cache kept after component unmounts
            retry: 1, // retry once on failure
            refetchOnWindowFocus: true, // sync data when user returns to tab
            refetchOnReconnect: true, // sync data on network reconnect
         },
         mutations: {
            retry: 0, // never retry mutations automatically
         },
      },
   });
}

export function QueryProvider({ children }: { children: ReactNode }) {
   // useState with factory ensures each render gets its own QueryClient (important for SSR)
   const [queryClient] = useState(makeQueryClient);

   return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
   );
}

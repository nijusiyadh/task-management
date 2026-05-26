'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ROUTES } from '@/constants/routes';
import { signOut } from '@/infrastructure/auth/better-auth/client';

export function useLogout() {
   const router = useRouter();
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: () => signOut(),
      onSuccess: () => {
         queryClient.clear();
         router.replace(ROUTES.login.path);
      },
   });
}

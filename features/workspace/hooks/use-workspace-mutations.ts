import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/features/common/constants';
import {
   createWorkspace,
   updateWorkspace,
   deleteWorkspace,
} from '../api/workspace.api';

function useCreateWorkspace() {
   const client = useQueryClient();

   return useMutation({
      mutationFn: createWorkspace,
      onSuccess: async () => {
         await client.invalidateQueries({
            queryKey: QUERY_KEYS.workspaces.all,
         });
      },
   });
}

function useUpdateWorkspace(id: string, slug: string) {
   const client = useQueryClient();

   return useMutation({
      mutationFn: (data: { name?: string; description?: string }) =>
         updateWorkspace(id, data),
      onSuccess: async () => {
         await Promise.all([
            client.invalidateQueries({
               queryKey: QUERY_KEYS.workspaces.all,
            }),
            client.invalidateQueries({
               queryKey: QUERY_KEYS.workspaces.details(id),
            }),
            client.invalidateQueries({
               queryKey: QUERY_KEYS.workspaces.bySlug(slug),
            }),
         ]);
      },
   });
}

function useDeleteWorkspace(id: string, slug: string) {
   const client = useQueryClient();

   return useMutation({
      mutationFn: () => deleteWorkspace(id),
      onSuccess: async () => {
         await client.invalidateQueries({
            queryKey: QUERY_KEYS.workspaces.all,
         });
         client.removeQueries({ queryKey: QUERY_KEYS.workspaces.details(id) });
         client.removeQueries({ queryKey: QUERY_KEYS.workspaces.bySlug(slug) });
      },
   });
}

export { useCreateWorkspace, useUpdateWorkspace, useDeleteWorkspace };

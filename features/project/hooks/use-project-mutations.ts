import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/features/common/constants';
import {
   createProject,
   updateProject,
   deleteProject,
} from '../api/project.api';

function useCreateProject(workspaceId: string, workspaceSlug: string) {
   const client = useQueryClient();

   return useMutation({
      mutationFn: (data: { name: string; description?: string }) =>
         createProject(workspaceId, data),
      onSuccess: async () => {
         await Promise.all([
            client.invalidateQueries({
               queryKey: QUERY_KEYS.projects.all(workspaceId),
            }),
            client.invalidateQueries({
               queryKey: QUERY_KEYS.workspaces.details(workspaceId),
            }),
            client.invalidateQueries({
               queryKey: QUERY_KEYS.workspaces.bySlug(workspaceSlug),
            }),
         ]);
      },
   });
}

function useUpdateProject(workspaceId: string, projectId: string) {
   const client = useQueryClient();

   return useMutation({
      mutationFn: (data: { name?: string; description?: string }) =>
         updateProject(workspaceId, projectId, data),
      onSuccess: async () => {
         await Promise.all([
            client.invalidateQueries({
               queryKey: QUERY_KEYS.projects.all(workspaceId),
            }),
            client.invalidateQueries({
               queryKey: QUERY_KEYS.projects.details(workspaceId, projectId),
            }),
         ]);
      },
   });
}

function useDeleteProject(
   workspaceId: string,
   projectId: string,
   workspaceSlug: string
) {
   const client = useQueryClient();

   return useMutation({
      mutationFn: () => deleteProject(workspaceId, projectId),
      onSuccess: async () => {
         await Promise.all([
            client.invalidateQueries({
               queryKey: QUERY_KEYS.projects.all(workspaceId),
            }),
            client.invalidateQueries({
               queryKey: QUERY_KEYS.workspaces.details(workspaceId),
            }),
            client.invalidateQueries({
               queryKey: QUERY_KEYS.workspaces.bySlug(workspaceSlug),
            }),
         ]);
         client.removeQueries({
            queryKey: QUERY_KEYS.projects.details(workspaceId, projectId),
         });
      },
   });
}

export { useCreateProject, useUpdateProject, useDeleteProject };

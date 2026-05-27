import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/features/common/constants';
import { getWorkspaceProjects, getProject } from '../api/project.api';

function useWorkspaceProjects(workspaceId: string) {
   return useQuery({
      queryKey: QUERY_KEYS.projects.all(workspaceId),
      queryFn: () => getWorkspaceProjects(workspaceId),
      enabled: !!workspaceId,
   });
}

function useProject(workspaceId: string, projectId: string) {
   return useQuery({
      queryKey: QUERY_KEYS.projects.details(workspaceId, projectId),
      queryFn: () => getProject(workspaceId, projectId),
      enabled: !!workspaceId && !!projectId,
   });
}

export { useWorkspaceProjects, useProject };

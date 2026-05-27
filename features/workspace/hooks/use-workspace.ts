import { QUERY_KEYS } from '@/features/common/constants';
import {
   getWorkspaces,
   getWorkspace,
   getWorkspaceBySlug,
} from '../api/workspace.api';
import { useQuery } from '@tanstack/react-query';

function useWorkspaces({ enabled = true }: { enabled?: boolean }) {
   return useQuery({
      enabled,
      queryKey: QUERY_KEYS.workspaces.all,
      queryFn: getWorkspaces,
   });
}

function useWorkspace(id: string) {
   return useQuery({
      queryKey: QUERY_KEYS.workspaces.details(id),
      queryFn: () => getWorkspace(id),
      enabled: !!id,
   });
}

function useWorkspaceBySlug(slug: string) {
   return useQuery({
      queryKey: QUERY_KEYS.workspaces.bySlug(slug),
      queryFn: () => getWorkspaceBySlug(slug),
      enabled: !!slug,
   });
}

export { useWorkspaces, useWorkspace, useWorkspaceBySlug };

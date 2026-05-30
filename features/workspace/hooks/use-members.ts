import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/features/common/constants';
import { getWorkspaceMembers } from '../api/member.api';

function useWorkspaceMembers(workspaceId: string) {
   return useQuery({
      queryKey: QUERY_KEYS.members.all(workspaceId),
      queryFn: () => getWorkspaceMembers(workspaceId),
      enabled: !!workspaceId,
   });
}

export { useWorkspaceMembers };

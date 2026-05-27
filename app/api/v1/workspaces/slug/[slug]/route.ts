import { NotFoundError } from '@/core/domain/errors';
import { workspaceService } from '@/infrastructure/container';
import { requireWorkspaceMember, successResponse, withAuth } from '@/lib/api';

/** GET /api/v1/workspaces/slug/[slug] — returns workspace with current user's role */
export const GET = withAuth(async (_req, { session, params }) => {
   const { slug } = await params;

   const workspace = await workspaceService.getWorkspaceBySlug(slug);
   if (!workspace) throw new NotFoundError('workspace');

   const member = await requireWorkspaceMember(workspace.id, session.userId);

   return successResponse({ ...workspace, role: member.role });
});

import { NotFoundError } from '@/core/domain/errors';
import { updateWorkspaceSchema } from '@/features/workspace/schemas';
import { workspaceService } from '@/infrastructure/container';
import {
   errorResponse,
   parseBody,
   requireWorkspaceMember,
   successResponse,
   withAuth,
} from '@/lib/api';
import { NextRequest } from 'next/server';

/** GET /api/v1/workspaces/[workspaceId] — returns the workspace, requires membership */
export const GET = withAuth(async (_req: NextRequest, { session, params }) => {
   const { workspaceId } = await params;

   await requireWorkspaceMember(workspaceId, session.userId);

   const workspace = await workspaceService.getWorkspaceById(workspaceId);
   if (!workspace) throw new NotFoundError('workspace');

   return successResponse(workspace);
});

/** PATCH /api/v1/workspaces/[workspaceId] — updates name or description, requires ADMIN or OWNER role */
export const PATCH = withAuth(async (req: NextRequest, { session, params }) => {
   const { workspaceId } = await params;

   await requireWorkspaceMember(workspaceId, session.userId, [
      'OWNER',
      'ADMIN',
   ]);

   const { data, error } = await parseBody(req, updateWorkspaceSchema);

   if (error)
      return errorResponse({
         statusCode: 400,
         details: Object.fromEntries(error.map((e) => [e.field, [e.message]])),
      });

   const workspace = await workspaceService.updateWorkspace(workspaceId, data);
   return successResponse(workspace);
});

/** DELETE /api/v1/workspaces/[workspaceId] — permanently deletes the workspace, requires OWNER role */
export const DELETE = withAuth(
   async (_req: NextRequest, { session, params }) => {
      const { workspaceId } = await params;

      await requireWorkspaceMember(workspaceId, session.userId, ['OWNER']);

      await workspaceService.deleteWorkspace(workspaceId);
      return successResponse(null);
   }
);

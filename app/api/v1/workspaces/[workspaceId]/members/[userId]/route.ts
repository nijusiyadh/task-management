import { NextRequest } from 'next/server';
import { updateMemberRoleSchema } from '@/features/workspace/schemas/member.schema';
import { workspaceService } from '@/infrastructure/container';
import {
   errorResponse,
   parseBody,
   requireWorkspaceMember,
   successResponse,
   withAuth,
} from '@/lib/api';

/** PATCH /api/v1/workspaces/[workspaceId]/members/[userId] — change a member's role, requires OWNER */
export const PATCH = withAuth(async (req: NextRequest, { session, params }) => {
   const { workspaceId, userId } = await params;

   await requireWorkspaceMember(workspaceId, session.userId, ['OWNER']);

   if (userId === session.userId)
      return errorResponse({
         statusCode: 400,
         message: 'You cannot change your own role',
      });

   const { data, error } = await parseBody(req, updateMemberRoleSchema);
   if (error)
      return errorResponse({
         statusCode: 400,
         details: Object.fromEntries(error.map((e) => [e.field, [e.message]])),
      });

   const member = await workspaceService.updateMemberRole({
      workspaceId,
      userId,
      role: data.role,
   });

   return successResponse(member);
});

/** DELETE /api/v1/workspaces/[workspaceId]/members/[userId] — remove a member, requires OWNER */
export const DELETE = withAuth(
   async (_req: NextRequest, { session, params }) => {
      const { workspaceId, userId } = await params;

      await requireWorkspaceMember(workspaceId, session.userId, ['OWNER']);

      if (userId === session.userId)
         return errorResponse({
            statusCode: 400,
            message: 'You cannot remove yourself from the workspace',
         });

      await workspaceService.removeMember(workspaceId, userId);
      return successResponse(null);
   }
);

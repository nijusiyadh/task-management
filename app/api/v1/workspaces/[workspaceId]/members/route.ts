import { NextRequest } from 'next/server';
import { NotFoundError } from '@/core/domain/errors';
import { inviteMemberSchema } from '@/features/workspace/schemas/member.schema';
import { prisma } from '@/infrastructure/database/prisma/client';
import { workspaceService } from '@/infrastructure/container';
import {
   errorResponse,
   parseBody,
   requireWorkspaceMember,
   successResponse,
   withAuth,
} from '@/lib/api';

/** GET /api/v1/workspaces/[workspaceId]/members — lists all members with user info */
export const GET = withAuth(async (_req: NextRequest, { session, params }) => {
   const { workspaceId } = await params;

   await requireWorkspaceMember(workspaceId, session.userId);

   const members = await workspaceService.getMembersWithUsers(workspaceId);
   return successResponse(members);
});

/** POST /api/v1/workspaces/[workspaceId]/members — invite a user by email, requires OWNER or ADMIN */
export const POST = withAuth(async (req: NextRequest, { session, params }) => {
   const { workspaceId } = await params;

   await requireWorkspaceMember(workspaceId, session.userId, [
      'OWNER',
      'ADMIN',
   ]);

   const { data, error } = await parseBody(req, inviteMemberSchema);

   if (error) {
      return errorResponse({
         statusCode: 400,
         details: Object.fromEntries(error.map((e) => [e.field, [e.message]])),
      });
   }

   const user = await prisma.user.findUnique({ where: { email: data.email } });

   if (!user) {
      // TODO: instead of rejecting, create a pending invitation record and send
      // an email inviting the person to register. On sign-up, detect the pending
      // invite by email and auto-add them to the workspace with the requested role.
      throw new NotFoundError('user');
   }

   const existing = await workspaceService.getMember(workspaceId, user.id);

   if (existing) {
      return errorResponse({
         statusCode: 409,
         message: 'User is already a member of this workspace',
      });
   }

   const member = await workspaceService.addMember({
      workspaceId,
      userId: user.id,
      role: data.role,
   });

   // TODO: send a "you've been added to <workspace>" notification email to user.email

   return successResponse(
      {
         ...member,
         user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
         },
      },
      undefined,
      201
   );
});

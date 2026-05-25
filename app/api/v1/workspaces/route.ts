import type { NextRequest } from 'next/server';
import { createWorkspaceSchema } from '@/features/workspace/schemas';
import { errorResponse, parseBody, successResponse, withAuth } from '@/lib/api';
import { workspaceService } from '@/infrastructure/container';

export const GET = withAuth(async (_req: NextRequest, { session }) => {
   const workspaces = await workspaceService.getUserWorkspaces(session.userId);
   return successResponse(workspaces);
});

export const POST = withAuth(async (req, { session }) => {
   const { data, error } = await parseBody(req, createWorkspaceSchema);

   if (error)
      return errorResponse({
         statusCode: 400,
         details: Object.fromEntries(error.map((e) => [e.field, [e.message]])),
      });

   const workspace = await workspaceService.createWorkspace({
      ...data,
      ownerId: session.userId,
   });

   return successResponse(workspace, undefined, 201);
});

import type { NextRequest } from 'next/server';
import { successResponse, withAuth } from '@/lib/api';
import { workspaceService } from '@/infrastructure/container';

export const GET = withAuth(async (_req: NextRequest, { session }) => {
   const workspaces = await workspaceService.getUserWorkspaces(session.userId);
   return successResponse(workspaces);
});

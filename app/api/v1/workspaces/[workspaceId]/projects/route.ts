import { NextRequest } from 'next/server';
import { createProjectSchema } from '@/features/project/schemas/project.schema';
import { projectService } from '@/infrastructure/container';
import {
   errorResponse,
   parseBody,
   requireWorkspaceMember,
   successResponse,
   withAuth,
} from '@/lib/api';

/** GET /api/v1/workspaces/[workspaceId]/projects — returns all projects in a workspace, requires membership */
export const GET = withAuth(async (_req: NextRequest, { session, params }) => {
   const { workspaceId } = await params;

   await requireWorkspaceMember(workspaceId, session.userId);

   const projects = await projectService.getWorkspaceProjects(workspaceId);

   return successResponse(projects);
});

/** POST /api/v1/workspaces/[workspaceId]/projects — creates a project in a workspace, requires OWNER or ADMIN */
export const POST = withAuth(async (req: NextRequest, { session, params }) => {
   const { workspaceId } = await params;

   await requireWorkspaceMember(workspaceId, session.userId, [
      'OWNER',
      'ADMIN',
   ]);

   const { data, error } = await parseBody(req, createProjectSchema);

   if (error)
      return errorResponse({
         statusCode: 400,
         details: Object.fromEntries(error.map((e) => [e.field, [e.message]])),
      });

   const project = await projectService.createProject({
      ...data,
      workspaceId: workspaceId,
   });

   return successResponse(project, undefined, 201);
});

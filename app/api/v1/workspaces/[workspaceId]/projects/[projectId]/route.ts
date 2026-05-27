import { NextRequest } from 'next/server';
import { NotFoundError } from '@/core/domain/errors';
import { updateProjectSchema } from '@/features/project/schemas/project.schema';
import { projectService } from '@/infrastructure/container';
import {
   errorResponse,
   parseBody,
   requireWorkspaceMember,
   successResponse,
   withAuth,
} from '@/lib/api';

/** GET /api/v1/workspaces/[workspaceId]/projects/[projectId] — returns a single project, requires membership */
export const GET = withAuth(async (_req: NextRequest, { session, params }) => {
   const { workspaceId, projectId } = await params;

   await requireWorkspaceMember(workspaceId, session.userId);

   const project = await projectService.getProjectById(projectId);
   if (!project) throw new NotFoundError('project');

   return successResponse(project);
});

/** PATCH /api/v1/workspaces/[workspaceId]/projects/[projectId] — updates a project, requires OWNER or ADMIN */
export const PATCH = withAuth(async (req: NextRequest, { session, params }) => {
   const { workspaceId, projectId } = await params;

   await requireWorkspaceMember(workspaceId, session.userId, [
      'OWNER',
      'ADMIN',
   ]);

   const { data, error } = await parseBody(req, updateProjectSchema);

   if (error)
      return errorResponse({
         statusCode: 400,
         details: Object.fromEntries(error.map((e) => [e.field, [e.message]])),
      });

   const project = await projectService.updateProject(projectId, data);
   return successResponse(project);
});

/** DELETE /api/v1/workspaces/[workspaceId]/projects/[projectId] — deletes a project, requires OWNER or ADMIN */
export const DELETE = withAuth(
   async (_req: NextRequest, { session, params }) => {
      const { workspaceId, projectId } = await params;

      await requireWorkspaceMember(workspaceId, session.userId, [
         'OWNER',
         'ADMIN',
      ]);

      await projectService.deleteProject(projectId);
      return successResponse(null);
   }
);

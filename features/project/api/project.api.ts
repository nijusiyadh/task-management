import { httpClient } from '@/infrastructure/client-container';
import type { Project } from '@/core/domain/project/project.type';

async function getWorkspaceProjects(workspaceId: string): Promise<Project[]> {
   return httpClient.get(`/workspaces/${workspaceId}/projects`);
}

async function getProject(
   workspaceId: string,
   projectId: string
): Promise<Project> {
   return httpClient.get(`/workspaces/${workspaceId}/projects/${projectId}`);
}

async function createProject(
   workspaceId: string,
   data: { name: string; description?: string }
): Promise<Project> {
   return httpClient.post(`/workspaces/${workspaceId}/projects`, data);
}

async function updateProject(
   workspaceId: string,
   projectId: string,
   data: { name?: string; description?: string }
): Promise<Project> {
   return httpClient.patch(
      `/workspaces/${workspaceId}/projects/${projectId}`,
      data
   );
}

async function deleteProject(
   workspaceId: string,
   projectId: string
): Promise<void> {
   return httpClient.delete(`/workspaces/${workspaceId}/projects/${projectId}`);
}

export {
   getWorkspaceProjects,
   getProject,
   createProject,
   updateProject,
   deleteProject,
};

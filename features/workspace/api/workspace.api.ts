import { httpClient } from '@/infrastructure/client-container';
import type {
   Workspace,
   WorkspaceWithRole,
} from '@/core/domain/workspace/workspace.type';

async function getWorkspaces(): Promise<WorkspaceWithRole[]> {
   return httpClient.get('/workspaces');
}

async function getWorkspace(id: string): Promise<Workspace> {
   return httpClient.get(`/workspaces/${id}`);
}

async function createWorkspace(data: {
   name: string;
   slug: string;
   description?: string;
}): Promise<Workspace> {
   return httpClient.post('/workspaces', data);
}

async function updateWorkspace(
   id: string,
   data: { name?: string; description?: string }
): Promise<Workspace> {
   return httpClient.patch(`/workspaces/${id}`, data);
}

async function deleteWorkspace(id: string): Promise<void> {
   return httpClient.delete(`/workspaces/${id}`);
}

export {
   getWorkspaces,
   getWorkspace,
   createWorkspace,
   updateWorkspace,
   deleteWorkspace,
};

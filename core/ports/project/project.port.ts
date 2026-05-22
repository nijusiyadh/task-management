import { Label, Project } from '@/core/domain/project/project.type';

interface IProjectPort {
   /** Creates a new project scoped to the given workspace */
   createProject(data: {
      name: string;
      description?: string;
      workspaceId: string;
   }): Promise<Project>;

   /** Returns a project by its ID, or null if it does not exist */
   getProjectById(id: string): Promise<Project | null>;

   /** Returns all projects belonging to a workspace */
   getWorkspaceProjects(workspaceId: string): Promise<Project[]>;

   /** Updates the name or description of a project */
   updateProject(
      id: string,
      data: Partial<Pick<Project, 'name' | 'description'>>
   ): Promise<Project>;

   /** Permanently deletes a project and all its tasks and labels */
   deleteProject(id: string): Promise<void>;

   /** Creates a named, coloured label scoped to a project */
   createLabel(data: {
      name: string;
      color: string;
      projectId: string;
   }): Promise<Label>;

   /** Returns all labels defined for a project */
   getProjectLabels(projectId: string): Promise<Label[]>;

   /** Permanently deletes a label and removes it from any tasks that use it */
   deleteLabel(id: string): Promise<void>;
}

export type { IProjectPort };

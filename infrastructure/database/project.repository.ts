import type { IProjectPort } from '@/core/ports/project/project.port';
import type { Label, Project } from '@/core/domain/project/project.type';
import type {
   PrismaClient,
   Project as PrismaProject,
   Label as PrismaLabel,
} from './prisma/generated/client';

export class ProjectRepository implements IProjectPort {
   constructor(private readonly db: PrismaClient) {}

   async createProject(data: {
      name: string;
      description?: string;
      workspaceId: string;
   }): Promise<Project> {
      const project = await this.db.project.create({ data });
      return this.toDomainProject(project);
   }

   async getProjectById(id: string): Promise<Project | null> {
      const project = await this.db.project.findUnique({ where: { id } });
      return project ? this.toDomainProject(project) : null;
   }

   async updateProject(
      id: string,
      data: Partial<Pick<Project, 'name' | 'description'>>
   ): Promise<Project> {
      const updated = await this.db.project.update({ where: { id }, data });
      return this.toDomainProject(updated);
   }

   async getWorkspaceProjects(workspaceId: string): Promise<Project[]> {
      const projects = await this.db.project.findMany({
         where: { workspaceId },
      });
      return projects.map((p) => this.toDomainProject(p));
   }

   async deleteProject(id: string): Promise<void> {
      await this.db.project.delete({ where: { id } });
   }

   async createLabel(data: {
      name: string;
      color: string;
      projectId: string;
   }): Promise<Label> {
      const label = await this.db.label.create({ data });
      return this.toDomainLabel(label);
   }

   async deleteLabel(id: string): Promise<void> {
      await this.db.label.delete({ where: { id } });
   }

   async getProjectLabels(projectId: string): Promise<Label[]> {
      const labels = await this.db.label.findMany({ where: { projectId } });
      return labels.map((l) => this.toDomainLabel(l));
   }

   private toDomainProject(data: PrismaProject): Project {
      return {
         id: data.id,
         name: data.name,
         description: data.description,
         workspaceId: data.workspaceId,
         createdAt: data.createdAt,
         updatedAt: data.updatedAt,
      };
   }

   private toDomainLabel(data: PrismaLabel): Label {
      return {
         id: data.id,
         name: data.name,
         color: data.color,
         projectId: data.projectId,
         createdAt: data.createdAt,
         updatedAt: data.updatedAt,
      };
   }
}

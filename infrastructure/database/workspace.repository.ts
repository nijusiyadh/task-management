import {
   PrismaClient,
   Workspace as PrismaWorkspace,
   WorkspaceMember as PrismaWorkspaceMember,
} from './prisma/generated/client';
import type { IWorkspacePort } from '@/core/ports/workspace/workspace.port';
import type {
   Workspace,
   WorkspaceMember,
   WorkspaceMemberWithUser,
   WorkspaceRole,
   WorkspaceWithRole,
} from '@/core/domain/workspace/workspace.type';

export class WorkspaceRepository implements IWorkspacePort {
   constructor(private readonly db: PrismaClient) {}

   async createWorkspace(data: {
      name: string;
      slug: string;
      description?: string;
      ownerId: string;
   }): Promise<Workspace> {
      const workspace = await this.db.$transaction(async (tx) => {
         const created = await tx.workspace.create({ data });
         await tx.workspaceMember.create({
            data: {
               workspaceId: created.id,
               userId: data.ownerId,
               role: 'OWNER',
            },
         });
         return created;
      });
      return this.toDomainWorkspace(workspace);
   }

   async getWorkspaceById(id: string): Promise<Workspace | null> {
      const workspace = await this.db.workspace.findUnique({ where: { id } });
      return workspace ? this.toDomainWorkspace(workspace) : null;
   }

   async getWorkspaceBySlug(
      slug: string
   ): Promise<
      (Workspace & { memberCount: number; projectCount: number }) | null
   > {
      const workspace = await this.db.workspace.findUnique({
         where: { slug },
         include: {
            _count: {
               select: {
                  workspaceMembers: true,
                  projects: true,
               },
            },
         },
      });
      if (!workspace) return null;
      return {
         ...this.toDomainWorkspace(workspace),
         memberCount: workspace._count.workspaceMembers,
         projectCount: workspace._count.projects,
      };
   }

   async getUserWorkspaces(userId: string): Promise<WorkspaceWithRole[]> {
      const workspaces = await this.db.workspace.findMany({
         where: {
            OR: [
               { ownerId: userId },
               { workspaceMembers: { some: { userId } } },
            ],
         },
         include: {
            workspaceMembers: {
               where: { userId },
               select: { role: true },
            },
            _count: {
               select: {
                  workspaceMembers: true,
                  projects: true,
               },
            },
         },
      });

      return workspaces.map((w) => ({
         ...this.toDomainWorkspace(w),
         role: w.workspaceMembers[0].role as WorkspaceRole,
         memberCount: w._count.workspaceMembers,
         projectCount: w._count.projects,
      }));
   }

   async deleteWorkspace(id: string): Promise<void> {
      await this.db.workspace.delete({ where: { id } });
   }

   async updateWorkspace(
      id: string,
      data: Partial<Pick<Workspace, 'name' | 'description'>>
   ): Promise<Workspace> {
      const updated = await this.db.workspace.update({ where: { id }, data });
      return this.toDomainWorkspace(updated);
   }

   async addMember(data: {
      workspaceId: string;
      userId: string;
      role: WorkspaceRole;
   }): Promise<WorkspaceMember> {
      const member = await this.db.workspaceMember.create({
         data,
      });
      return this.toDomainMember(member);
   }

   async getMember(
      workspaceId: string,
      userId: string
   ): Promise<WorkspaceMember | null> {
      const member = await this.db.workspaceMember.findUnique({
         where: { workspaceId_userId: { userId, workspaceId } },
      });
      return member ? this.toDomainMember(member) : null;
   }

   async getMembers(workspaceId: string): Promise<WorkspaceMember[]> {
      const members = await this.db.workspaceMember.findMany({
         where: { workspaceId },
      });
      return members.map((m) => this.toDomainMember(m));
   }

   async getMembersWithUsers(
      workspaceId: string
   ): Promise<WorkspaceMemberWithUser[]> {
      const members = await this.db.workspaceMember.findMany({
         where: { workspaceId },
         include: {
            user: {
               select: { id: true, name: true, email: true, image: true },
            },
         },
         orderBy: { joinedAt: 'asc' },
      });
      return members.map((m) => ({
         ...this.toDomainMember(m),
         user: {
            id: m.user.id,
            name: m.user.name,
            email: m.user.email,
            image: m.user.image,
         },
      }));
   }

   async removeMember(workspaceId: string, userId: string): Promise<void> {
      await this.db.workspaceMember.deleteMany({
         where: { userId, workspaceId },
      });
   }

   async updateMemberRole(data: {
      workspaceId: string;
      userId: string;
      role: WorkspaceRole;
   }): Promise<WorkspaceMember> {
      const updated = await this.db.workspaceMember.updateManyAndReturn({
         where: { userId: data.userId, workspaceId: data.workspaceId },
         data: { role: data.role },
      });
      return this.toDomainMember(updated[0]);
   }

   private toDomainWorkspace(data: PrismaWorkspace): Workspace {
      return {
         id: data.id,
         name: data.name,
         slug: data.slug,
         description: data.description,
         ownerId: data.ownerId,
         createdAt: data.createdAt,
         updatedAt: data.updatedAt,
      };
   }

   private toDomainMember(data: PrismaWorkspaceMember): WorkspaceMember {
      return {
         id: data.id,
         role: data.role,
         userId: data.userId,
         workspaceId: data.workspaceId,
         joinedAt: data.joinedAt,
         createdAt: data.createdAt,
         updatedAt: data.updatedAt,
      };
   }
}

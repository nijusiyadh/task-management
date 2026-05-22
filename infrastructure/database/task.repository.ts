import type { ICommentPort, ITaskPort } from '@/core/ports/task/task.port';
import type {
   Comment,
   Task,
   TaskPriority,
   TaskStatus,
} from '@/core/domain/task/task.type';
import type {
   PrismaClient,
   Task as PrismaTask,
   Comment as PrismaComment,
} from './prisma/generated/client';

export class TaskRepository implements ITaskPort, ICommentPort {
   constructor(private readonly db: PrismaClient) {}

   async createTask(data: {
      assigneeId?: string;
      creatorId: string;
      description?: string;
      dueDate?: Date;
      parentId?: string;
      priority?: TaskPriority;
      projectId: string;
      title: string;
   }): Promise<Task> {
      const task = await this.db.task.create({ data });
      return this.toDomainTask(task);
   }

   async getTaskById(id: string): Promise<Task | null> {
      const task = await this.db.task.findUnique({ where: { id } });
      return task ? this.toDomainTask(task) : null;
   }

   async getProjectTasks(projectId: string): Promise<Task[]> {
      const tasks = await this.db.task.findMany({
         where: { projectId },
         orderBy: { order: 'asc' },
      });
      return tasks.map((t) => this.toDomainTask(t));
   }

   async updateTask(
      id: string,
      data: Partial<
         Pick<
            Task,
            | 'title'
            | 'description'
            | 'status'
            | 'priority'
            | 'assigneeId'
            | 'dueDate'
            | 'order'
         >
      >
   ): Promise<Task> {
      const updated = await this.db.task.update({ where: { id }, data });
      return this.toDomainTask(updated);
   }

   async deleteTask(id: string): Promise<void> {
      await this.db.task.delete({ where: { id } });
   }

   async reorderTasks(tasks: { id: string; order: number }[]): Promise<void> {
      await this.db.$transaction(
         tasks.map(({ id, order }) =>
            this.db.task.update({ where: { id }, data: { order } })
         )
      );
   }

   async addLabel(taskId: string, labelId: string): Promise<void> {
      await this.db.taskLabel.create({ data: { taskId, labelId } });
   }

   async removeLabel(taskId: string, labelId: string): Promise<void> {
      await this.db.taskLabel.delete({
         where: { taskId_labelId: { taskId, labelId } },
      });
   }

   async createComment(data: {
      body: string;
      taskId: string;
      authorId: string;
   }): Promise<Comment> {
      const comment = await this.db.comment.create({ data });
      return this.toDomainComment(comment);
   }

   async getTaskComments(taskId: string): Promise<Comment[]> {
      const comments = await this.db.comment.findMany({
         where: { taskId },
         orderBy: { createdAt: 'asc' },
      });
      return comments.map((c) => this.toDomainComment(c));
   }

   async deleteComment(id: string): Promise<void> {
      await this.db.comment.delete({ where: { id } });
   }

   private toDomainTask(data: PrismaTask): Task {
      return {
         id: data.id,
         title: data.title,
         description: data.description,
         order: data.order,
         status: data.status as TaskStatus,
         priority: data.priority as TaskPriority,
         projectId: data.projectId,
         assigneeId: data.assigneeId,
         creatorId: data.creatorId,
         parentId: data.parentId,
         dueDate: data.dueDate,
         createdAt: data.createdAt,
         updatedAt: data.updatedAt,
      };
   }

   private toDomainComment(data: PrismaComment): Comment {
      return {
         id: data.id,
         body: data.body,
         taskId: data.taskId,
         authorId: data.authorId,
         createdAt: data.createdAt,
         updatedAt: data.updatedAt,
      };
   }
}

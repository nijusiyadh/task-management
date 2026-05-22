type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED';
type TaskPriority = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';

type Task = {
   id: string;
   title: string;
   description: string | null;
   order: number;
   status: TaskStatus;
   priority: TaskPriority;
   projectId: string;
   assigneeId: string | null;
   creatorId: string;
   parentId: string | null;
   dueDate: Date | null;
   createdAt: Date;
   updatedAt: Date;
};

type Comment = {
   id: string;
   body: string;
   taskId: string;
   authorId: string;
   createdAt: Date;
   updatedAt: Date;
};

export type { TaskStatus, TaskPriority, Task, Comment };

import { Comment, Task, TaskPriority } from '@/core/domain/task/task.type';

interface ITaskPort {
   /** Creates a new task inside a project, optionally assigned and nested under a parent task */
   createTask(data: {
      assigneeId?: string;
      creatorId: string;
      description?: string;
      dueDate?: Date;
      parentId?: string;
      priority?: TaskPriority;
      projectId: string;
      title: string;
   }): Promise<Task>;

   /** Returns a task by its ID, or null if it does not exist */
   getTaskById(id: string): Promise<Task | null>;

   /** Returns all tasks belonging to a project, ordered by the order field */
   getProjectTasks(projectId: string): Promise<Task[]>;

   /** Updates one or more fields of a task — status, priority, assignee, due date, or position */
   updateTask(
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
   ): Promise<Task>;

   /** Permanently deletes a task and all its subtasks and comments */
   deleteTask(id: string): Promise<void>;

   /** Persists new order values for multiple tasks at once, used after drag-and-drop reordering */
   reorderTasks(tasks: { id: string; order: number }[]): Promise<void>;

   /** Applies a label to a task */
   addLabel(taskId: string, labelId: string): Promise<void>;

   /** Removes a label from a task */
   removeLabel(taskId: string, labelId: string): Promise<void>;
}

interface ICommentPort {
   /** Creates a new comment on a task authored by the given user */
   createComment(data: {
      body: string;
      taskId: string;
      authorId: string;
   }): Promise<Comment>;

   /** Returns all comments on a task in chronological order */
   getTaskComments(taskId: string): Promise<Comment[]>;

   /** Permanently deletes a comment */
   deleteComment(id: string): Promise<void>;
}

export type { ITaskPort, ICommentPort };

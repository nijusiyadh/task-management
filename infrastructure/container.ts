import type { IAuthenticationPort } from '@/core/ports/auth/authentication.port';
import type { IWorkspacePort } from '@/core/ports/workspace/workspace.port';
import type { IProjectPort } from '@/core/ports/project/project.port';
import type { ICommentPort, ITaskPort } from '@/core/ports/task/task.port';
import type { ILoggerPort } from '@/core/ports/logger/logger.port';

import { BetterAuthAdapter } from './auth/better-auth/better-auth.adapter';
import { ProjectRepository } from './database/project.repository';
import { TaskRepository } from './database/task.repository';
import { WorkspaceRepository } from './database/workspace.repository';
import { auth } from './auth/better-auth/config';
import { pinoLogger } from './logger/pino.logger';
import { prisma } from './database/prisma/client';

const betterAuthAdapter = new BetterAuthAdapter(auth);
const taskRepository = new TaskRepository(prisma);

export const authenticationService: IAuthenticationPort = betterAuthAdapter;

export const workspaceService: IWorkspacePort = new WorkspaceRepository(prisma);
export const projectService: IProjectPort = new ProjectRepository(prisma);
export const taskService: ITaskPort = taskRepository;
export const commentService: ICommentPort = taskRepository;

export const logger: ILoggerPort = pinoLogger;

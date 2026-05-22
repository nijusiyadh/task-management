import type { IAuthenticationPort } from '@/core/ports/auth/authentication.port';
import type { IAuthorizationPort } from '@/core/ports/auth/authorization.port';
import type { IWorkspacePort } from '@/core/ports/workspace/workspace.port';
import type { IProjectPort } from '@/core/ports/project/project.port';

import { BetterAuthAdapter } from './auth/better-auth/better-auth.adapter';
import { auth } from './auth/better-auth/config';

import { WorkspaceRepository } from './database/workspace.repository';
import { prisma } from './database/prisma/client';
import { ProjectRepository } from './database/project.repository';

const betterAuthAdapter = new BetterAuthAdapter(auth);

export const authenticationService: IAuthenticationPort = betterAuthAdapter;
export const authorizationService: IAuthorizationPort = betterAuthAdapter;

export const workspaceService: IWorkspacePort = new WorkspaceRepository(prisma);
export const projectService: IProjectPort = new ProjectRepository(prisma);

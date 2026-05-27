'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { WorkspaceWithRole } from '@/core/domain/workspace/workspace.type';
import { useWorkspaceBySlug } from '../hooks/use-workspace';

function WorkspacePageSkeleton() {
   return (
      <div className="grid gap-6">
         <div className="flex items-center justify-between">
            <div className="grid gap-2">
               <Skeleton className="h-6 w-48" />
               <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-8 w-28 rounded-lg" />
         </div>

         <div className="flex gap-3">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
         </div>

         <div className="grid gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
               <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
         </div>
      </div>
   );
}

interface WorkspaceContextValue {
   workspace: WorkspaceWithRole;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function useWorkspaceContext(): WorkspaceContextValue {
   const ctx = useContext(WorkspaceContext);
   if (!ctx) {
      throw new Error(
         'useWorkspaceContext must be used within a WorkspaceProvider'
      );
   }
   return ctx;
}

function WorkspaceErrorState() {
   const router = useRouter();

   return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
         <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="size-6 text-destructive" />
         </div>
         <div>
            <p className="font-medium">Workspace not found</p>
            <p className="mt-1 text-sm text-muted-foreground">
               This workspace doesn&apos;t exist or you don&apos;t have access
               to it.
            </p>
         </div>
         <Button variant="outline" onClick={() => router.push('/')}>
            Back to workspaces
         </Button>
      </div>
   );
}

interface WorkspaceProviderProps {
   children: ReactNode;
   slug: string;
}

export function WorkspaceProvider({ children, slug }: WorkspaceProviderProps) {
   const { data: workspace, isPending, isError } = useWorkspaceBySlug(slug);

   if (isPending) {
      return <WorkspacePageSkeleton />;
   }

   if (isError || !workspace) {
      return <WorkspaceErrorState />;
   }

   return (
      <WorkspaceContext.Provider value={{ workspace }}>
         {children}
      </WorkspaceContext.Provider>
   );
}

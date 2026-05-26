'use client';

import { useState } from 'react';
import { FolderOpen, Search, SearchX } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import type { Workspace } from '@/core/domain/workspace/workspace.type';
import { useWorkspaces } from '../hooks/use-workspace';
import { WorkspaceListItem } from './workspace-list-item';

function WorkspaceSearchInput({
   value,
   onChange,
}: {
   value: string;
   onChange: (value: string) => void;
}) {
   return (
      <div className="relative">
         <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
         <Input
            placeholder="Search workspaces..."
            className="pl-9"
            value={value}
            onChange={(e) => onChange(e.target.value)}
         />
      </div>
   );
}

function WorkspaceListSkeleton() {
   return (
      <div className="grid gap-2">
         {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-15 w-full rounded-lg" />
         ))}
      </div>
   );
}

function WorkspaceEmptyState({ search }: { search: string }) {
   return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center">
         {search ? (
            <>
               <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <SearchX className="size-5 text-muted-foreground" />
               </div>
               <div>
                  <p className="font-medium">No results found</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                     No workspaces match{' '}
                     <span className="font-medium text-foreground">
                        &ldquo;{search}&rdquo;
                     </span>
                     . Try a different search term.
                  </p>
               </div>
            </>
         ) : (
            <>
               <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <FolderOpen className="size-5 text-muted-foreground" />
               </div>
               <div>
                  <p className="font-medium">No workspaces yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                     Create your first workspace to start organizing your
                     projects.
                  </p>
               </div>
            </>
         )}
      </div>
   );
}

function WorkspaceListError() {
   return (
      <p className="py-8 text-center text-sm text-muted-foreground">
         Failed to load workspaces. Please try again.
      </p>
   );
}

function WorkspaceItems({ workspaces }: { workspaces: Workspace[] }) {
   return (
      <div className="grid gap-2">
         {workspaces.map((workspace) => (
            <WorkspaceListItem key={workspace.id} workspace={workspace} />
         ))}
      </div>
   );
}

export function WorkspaceList() {
   const { data: workspaces, isPending, isError } = useWorkspaces({});
   const [search, setSearch] = useState('');

   // TODO: implement server-side search — fetch workspaces from API with search query
   function handleSearch(value: string) {
      setSearch(value);
   }

   return (
      <div className="grid gap-4">
         <WorkspaceSearchInput value={search} onChange={handleSearch} />

         {isPending && <WorkspaceListSkeleton />}

         {isError && <WorkspaceListError />}

         {!isPending &&
            !isError &&
            (!workspaces || workspaces.length === 0) && (
               <WorkspaceEmptyState search={search} />
            )}

         {!isPending && !isError && workspaces && workspaces.length > 0 && (
            <WorkspaceItems workspaces={workspaces} />
         )}
      </div>
   );
}

'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CreateWorkspaceDialog } from '@/features/workspace/components';
import { WorkspaceList } from '@/features/workspace/components';

export default function Home() {
   const [createOpen, setCreateOpen] = useState(false);

   return (
      <section className="grid gap-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-xl font-semibold tracking-tight">
                  Workspaces
               </h1>
               <p className="text-sm text-muted-foreground">
                  Manage and switch between your workspaces
               </p>
            </div>
            <Button onClick={() => setCreateOpen(true)}>
               <Plus />
               New workspace
            </Button>
         </div>

         <WorkspaceList />

         <CreateWorkspaceDialog
            open={createOpen}
            onOpenChange={setCreateOpen}
         />
      </section>
   );
}

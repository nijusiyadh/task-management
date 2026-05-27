'use client';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteProject } from '../hooks/use-project-mutations';

interface DeleteProjectDialogProps {
   workspaceId: string;
   workspaceSlug: string;
   projectId: string;
   projectName: string;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

export function DeleteProjectDialog({
   workspaceId,
   workspaceSlug,
   projectId,
   projectName,
   open,
   onOpenChange,
}: DeleteProjectDialogProps) {
   const { mutate, isPending } = useDeleteProject(
      workspaceId,
      projectId,
      workspaceSlug
   );

   function handleDelete() {
      mutate(undefined, {
         onSuccess: () => {
            onOpenChange(false);
            toast.success('Project deleted');
         },
         onError: () => toast.error('Failed to delete project'),
      });
   }

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle className="font-urbanist">
                  Delete project
               </DialogTitle>
            </DialogHeader>
            <p className="font-urbanist text-sm text-muted-foreground">
               Are you sure you want to delete{' '}
               <span className="font-medium text-foreground">
                  {projectName}
               </span>
               ? This will permanently remove all tasks inside it.
            </p>
            <DialogFooter>
               <Button
                  variant="destructive"
                  className="font-urbanist"
                  loading={isPending}
                  onClick={handleDelete}>
                  Delete project
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}

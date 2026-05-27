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
import { useDeleteWorkspace } from '../hooks/use-workspace-mutations';

interface DeleteWorkspaceDialogProps {
   workspaceId: string;
   workspaceName: string;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

export function DeleteWorkspaceDialog({
   workspaceId,
   workspaceName,
   open,
   onOpenChange,
}: DeleteWorkspaceDialogProps) {
   const { mutate, isPending } = useDeleteWorkspace(workspaceId);

   const handleDelete = () => {
      mutate(undefined, {
         onSuccess: () => {
            onOpenChange(false);
            toast.success('Workspace deleted');
         },
         onError: () => toast.error('Failed to delete workspace'),
      });
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle className="font-urbanist">
                  Delete workspace
               </DialogTitle>
            </DialogHeader>
            <p className="font-urbanist text-sm text-muted-foreground">
               Are you sure you want to delete{' '}
               <span className="font-medium text-foreground">
                  {workspaceName}
               </span>
               ? This action cannot be undone.
            </p>
            <DialogFooter>
               <Button
                  variant="destructive"
                  loading={isPending}
                  className="font-urbanist"
                  onClick={handleDelete}>
                  Delete workspace
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}

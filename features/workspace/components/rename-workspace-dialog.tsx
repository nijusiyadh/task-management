'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { updateWorkspaceSchema } from '../schemas/workspace.schema';
import { useUpdateWorkspace } from '../hooks/use-workspace-mutations';

type FormValues = z.infer<typeof updateWorkspaceSchema>;

interface RenameWorkspaceDialogProps {
   workspaceId: string;
   currentName: string;
   open: boolean;
   onOpenChange: (open: boolean) => void;
   workspaceSlug: string;
}

export function RenameWorkspaceDialog({
   workspaceId,
   currentName,
   open,
   onOpenChange,
   workspaceSlug,
}: RenameWorkspaceDialogProps) {
   const { mutate, isPending } = useUpdateWorkspace(workspaceId, workspaceSlug);

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<FormValues>({
      resolver: zodResolver(updateWorkspaceSchema),
      defaultValues: { name: currentName },
   });

   useEffect(() => {
      if (open) reset({ name: currentName });
   }, [open, currentName, reset]);

   function onSubmit(data: FormValues) {
      mutate(data, {
         onSuccess: () => {
            onOpenChange(false);
            toast.success('Workspace renamed');
         },
         onError: () => toast.error('Failed to rename workspace'),
      });
   }

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle className="font-urbanist">
                  Rename workspace
               </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
               <div className="grid gap-1.5 font-urbanist">
                  <Label htmlFor="name">Name</Label>
                  <Input
                     id="name"
                     aria-invalid={!!errors.name}
                     {...register('name')}
                  />
                  {errors.name && (
                     <p className="text-xs text-destructive">
                        {errors.name.message}
                     </p>
                  )}
               </div>

               <DialogFooter>
                  <Button
                     type="submit"
                     className="font-urbanist"
                     loading={isPending}>
                     Save
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}

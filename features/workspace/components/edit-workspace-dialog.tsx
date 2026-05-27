'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

interface EditWorkspaceDialogProps {
   workspaceId: string;
   currentName: string;
   currentDescription?: string | null;
   open: boolean;
   onOpenChange: (open: boolean) => void;
   workspaceSlug: string;
}

export function EditWorkspaceDialog({
   workspaceId,
   currentName,
   currentDescription,
   open,
   onOpenChange,
   workspaceSlug,
}: EditWorkspaceDialogProps) {
   const { mutate, isPending } = useUpdateWorkspace(workspaceId, workspaceSlug);

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<FormValues>({
      resolver: zodResolver(updateWorkspaceSchema),
      defaultValues: {
         name: currentName,
         description: currentDescription ?? '',
      },
   });

   useEffect(() => {
      if (open)
         reset({ name: currentName, description: currentDescription ?? '' });
   }, [open, currentName, currentDescription, reset]);

   function onSubmit(data: FormValues) {
      mutate(data, {
         onSuccess: () => {
            onOpenChange(false);
            toast.success('Workspace updated');
         },
         onError: () => toast.error('Failed to update workspace'),
      });
   }

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle className="font-urbanist">
                  Edit workspace
               </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
               <div className="grid gap-1.5 font-urbanist">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                     id="edit-name"
                     aria-invalid={!!errors.name}
                     {...register('name')}
                  />
                  {errors.name && (
                     <p className="text-xs text-destructive">
                        {errors.name.message}
                     </p>
                  )}
               </div>

               <div className="grid gap-1.5 font-urbanist">
                  <Label htmlFor="edit-description">
                     Description{' '}
                     <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                     id="edit-description"
                     placeholder="What is this workspace for?"
                     aria-invalid={!!errors.description}
                     {...register('description')}
                  />
                  {errors.description && (
                     <p className="text-xs text-destructive">
                        {errors.description.message}
                     </p>
                  )}
               </div>

               <DialogFooter>
                  <Button
                     type="submit"
                     className="font-urbanist"
                     loading={isPending}>
                     Save changes
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}

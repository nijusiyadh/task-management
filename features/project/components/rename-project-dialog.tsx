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
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { updateProjectSchema } from '../schemas/project.schema';
import { useUpdateProject } from '../hooks/use-project-mutations';

type FormValues = z.infer<typeof updateProjectSchema>;

interface RenameProjectDialogProps {
   workspaceId: string;
   projectId: string;
   currentName: string;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

export function RenameProjectDialog({
   workspaceId,
   projectId,
   currentName,
   open,
   onOpenChange,
}: RenameProjectDialogProps) {
   const { mutate, isPending } = useUpdateProject(workspaceId, projectId);

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<FormValues>({
      resolver: zodResolver(updateProjectSchema),
      defaultValues: { name: currentName },
   });

   useEffect(() => {
      if (open) reset({ name: currentName });
   }, [open, currentName, reset]);

   function onSubmit(data: FormValues) {
      mutate(data, {
         onSuccess: () => {
            onOpenChange(false);
            toast.success('Project renamed');
         },
         onError: () => toast.error('Failed to rename project'),
      });
   }

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle className="font-urbanist">
                  Rename project
               </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
               <div className="grid gap-1.5 font-urbanist">
                  <Label htmlFor="project-rename">Name</Label>
                  <Input
                     id="project-rename"
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

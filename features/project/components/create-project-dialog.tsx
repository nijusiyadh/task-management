'use client';

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
import { createProjectSchema } from '../schemas/project.schema';
import { useCreateProject } from '../hooks/use-project-mutations';

type FormValues = z.infer<typeof createProjectSchema>;

interface CreateProjectDialogProps {
   workspaceId: string;
   workspaceSlug: string;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

export function CreateProjectDialog({
   workspaceId,
   workspaceSlug,
   open,
   onOpenChange,
}: CreateProjectDialogProps) {
   const { mutate, isPending } = useCreateProject(workspaceId, workspaceSlug);

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<FormValues>({
      resolver: zodResolver(createProjectSchema),
      defaultValues: { name: '', description: '' },
   });

   function onSubmit(data: FormValues) {
      mutate(data, {
         onSuccess: () => {
            reset();
            onOpenChange(false);
            toast.success('Project created');
         },
         onError: () => toast.error('Failed to create project'),
      });
   }

   function handleOpenChange(next: boolean) {
      if (!next) reset();
      onOpenChange(next);
   }

   return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle className="font-urbanist">New project</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
               <div className="grid gap-1.5 font-urbanist">
                  <Label htmlFor="project-name">Name</Label>
                  <Input
                     id="project-name"
                     placeholder="My project"
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
                  <Label htmlFor="project-description">
                     Description{' '}
                     <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                     id="project-description"
                     placeholder="What is this project about?"
                     {...register('description')}
                  />
               </div>

               <DialogFooter>
                  <Button
                     type="submit"
                     className="font-urbanist"
                     loading={isPending}>
                     Create project
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}

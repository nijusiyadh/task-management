'use client';

import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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
import { generateWorkspaceSlug } from '@/utils/workspace';
import { createWorkspaceSchema } from '../schemas/workspace.schema';
import { useCreateWorkspace } from '../hooks/use-workspace-mutations';

type FormValues = z.infer<typeof createWorkspaceSchema>;

interface CreateWorkspaceDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

export function CreateWorkspaceDialog({
   open,
   onOpenChange,
}: CreateWorkspaceDialogProps) {
   const { mutate, isPending } = useCreateWorkspace();

   const {
      register,
      handleSubmit,
      setValue,
      reset,
      control,
      formState: { errors },
   } = useForm<FormValues>({
      resolver: zodResolver(createWorkspaceSchema),
      defaultValues: { name: '', slug: '', description: '' },
   });

   const nameValue = useWatch({ control, name: 'name' });

   useEffect(() => {
      setValue('slug', generateWorkspaceSlug(nameValue), {
         shouldValidate: false,
      });
   }, [nameValue, setValue]);

   function onSubmit(data: FormValues) {
      mutate(data, {
         onSuccess: () => {
            reset();
            onOpenChange(false);
            toast.success('Workspace created');
         },
         onError: () => toast.error('Failed to create workspace'),
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
               <DialogTitle className="font-urbanist">
                  New workspace
               </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
               <div className="grid font-urbanist gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                     id="name"
                     placeholder="My workspace"
                     aria-invalid={!!errors.name}
                     className="font-urbanist"
                     {...register('name')}
                  />
                  {errors.name && (
                     <p className="text-xs text-destructive">
                        {errors.name.message}
                     </p>
                  )}
               </div>

               <div className="grid gap-1.5 font-urbanist">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                     id="slug"
                     placeholder="my-workspace"
                     className="font-urbanist"
                     aria-invalid={!!errors.slug}
                     {...register('slug')}
                  />
                  {errors.slug && (
                     <p className="text-xs text-destructive">
                        {errors.slug.message}
                     </p>
                  )}
               </div>

               <div className="grid gap-1.5 font-urbanist">
                  <Label htmlFor="description">
                     Description{' '}
                     <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                     id="description"
                     className="font-urbanist"
                     placeholder="What is this workspace for?"
                     {...register('description')}
                  />
               </div>

               <DialogFooter className="font-urbanist">
                  <Button type="submit" loading={isPending}>
                     Create workspace
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}

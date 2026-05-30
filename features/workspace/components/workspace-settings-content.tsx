'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import type { z } from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ROUTES } from '@/constants/routes';
import { updateWorkspaceSchema } from '../schemas/workspace.schema';
import { useUpdateWorkspace } from '../hooks/use-workspace-mutations';
import { useWorkspaceContext } from '../context/workspace-context';
import { DeleteWorkspaceDialog } from './delete-workspace-dialog';

type FormValues = z.infer<typeof updateWorkspaceSchema>;

function GeneralSection() {
   const { workspace } = useWorkspaceContext();
   const { mutate, isPending } = useUpdateWorkspace(
      workspace.id,
      workspace.slug
   );
   const canEdit = workspace.role === 'OWNER' || workspace.role === 'ADMIN';

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isDirty },
   } = useForm<FormValues>({
      resolver: zodResolver(updateWorkspaceSchema),
      defaultValues: {
         name: workspace.name,
         description: workspace.description ?? '',
      },
   });

   useEffect(() => {
      reset({ name: workspace.name, description: workspace.description ?? '' });
   }, [workspace.name, workspace.description, reset]);

   function onSubmit(data: FormValues) {
      mutate(data, {
         onSuccess: () => toast.success('Workspace updated'),
         onError: () => toast.error('Failed to update workspace'),
      });
   }

   return (
      <section className="grid gap-6">
         <div>
            <h2 className="font-urbanist text-base font-semibold">General</h2>
            <p className="text-sm text-muted-foreground">
               Update your workspace name and description.
            </p>
         </div>

         <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid max-w-lg gap-4">
            <div className="grid gap-1.5 font-urbanist">
               <Label htmlFor="settings-name">Name</Label>
               <Input
                  id="settings-name"
                  disabled={!canEdit}
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
               <Label htmlFor="settings-description">
                  Description{' '}
                  <span className="text-muted-foreground">(optional)</span>
               </Label>
               <Textarea
                  id="settings-description"
                  placeholder="What is this workspace for?"
                  disabled={!canEdit}
                  aria-invalid={!!errors.description}
                  {...register('description')}
               />
               {errors.description && (
                  <p className="text-xs text-destructive">
                     {errors.description.message}
                  </p>
               )}
            </div>

            {canEdit && (
               <div>
                  <Button
                     type="submit"
                     className="font-urbanist"
                     loading={isPending}
                     disabled={!isDirty}>
                     Save changes
                  </Button>
               </div>
            )}
         </form>
      </section>
   );
}

function DangerZoneSection() {
   const { workspace } = useWorkspaceContext();
   const router = useRouter();
   const [deleteOpen, setDeleteOpen] = useState(false);

   if (workspace.role !== 'OWNER') return null;

   return (
      <>
         <Separator />

         <section className="grid gap-6">
            <div>
               <h2 className="font-urbanist text-base font-semibold text-destructive">
                  Danger zone
               </h2>
               <p className="text-sm text-muted-foreground">
                  Permanently delete this workspace and all of its data.
               </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-destructive/40 p-4">
               <div>
                  <p className="font-urbanist text-sm font-medium">
                     Delete workspace
                  </p>
                  <p className="text-sm text-muted-foreground">
                     Once deleted, this workspace cannot be recovered.
                  </p>
               </div>
               <Button
                  variant="destructive"
                  className="font-urbanist"
                  onClick={() => setDeleteOpen(true)}>
                  Delete
               </Button>
            </div>
         </section>

         <DeleteWorkspaceDialog
            workspaceId={workspace.id}
            workspaceName={workspace.name}
            workspaceSlug={workspace.slug}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            onSuccess={() => router.push(ROUTES.workspaces.path)}
         />
      </>
   );
}

export function WorkspaceSettingsContent() {
   return (
      <div className="grid gap-8">
         <div>
            <h1 className="font-urbanist text-xl font-semibold">Settings</h1>
            <p className="text-sm text-muted-foreground">
               Manage your workspace settings.
            </p>
         </div>

         <GeneralSection />
         <DangerZoneSection />
      </div>
   );
}

'use client';

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
import { ApiError } from '@/infrastructure/http/axios.adapter';
import { inviteMemberSchema } from '../schemas/member.schema';
import { useInviteMember } from '../hooks/use-member-mutations';

type FormValues = z.infer<typeof inviteMemberSchema>;

interface InviteMemberDialogProps {
   workspaceId: string;
   workspaceSlug: string;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

export function InviteMemberDialog({
   workspaceId,
   workspaceSlug,
   open,
   onOpenChange,
}: InviteMemberDialogProps) {
   const { mutate, isPending } = useInviteMember(workspaceId, workspaceSlug);

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<FormValues>({
      resolver: zodResolver(inviteMemberSchema),
      defaultValues: { email: '', role: 'MEMBER' },
   });

   function onSubmit(data: FormValues) {
      mutate(data, {
         onSuccess: () => {
            reset();
            onOpenChange(false);
            toast.success('Member invited');
         },
         onError: (err: unknown) => {
            if (err instanceof ApiError) {
               if (err.statusCode === 404) {
                  toast.error('No account found with that email');
               } else if (err.statusCode === 409) {
                  toast.error('User is already a member');
               } else {
                  toast.error('Failed to invite member');
               }
            } else {
               toast.error('Failed to invite member');
            }
         },
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
                  Invite member
               </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
               <div className="grid gap-1.5 font-urbanist">
                  <Label htmlFor="invite-email">Email</Label>
                  <Input
                     id="invite-email"
                     type="email"
                     placeholder="colleague@example.com"
                     aria-invalid={!!errors.email}
                     {...register('email')}
                  />
                  {errors.email && (
                     <p className="text-xs text-destructive">
                        {errors.email.message}
                     </p>
                  )}
               </div>

               <div className="grid gap-1.5 font-urbanist">
                  <Label htmlFor="invite-role">Role</Label>
                  <select
                     id="invite-role"
                     className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                     {...register('role')}>
                     <option value="MEMBER">Member</option>
                     <option value="ADMIN">Admin</option>
                  </select>
               </div>

               <DialogFooter>
                  <Button
                     type="submit"
                     className="font-urbanist"
                     loading={isPending}>
                     Send invite
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}

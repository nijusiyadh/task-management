import z from 'zod';

export const inviteMemberSchema = z.object({
   email: z.string().min(1, 'Email is required'),
   role: z.enum(['ADMIN', 'MEMBER']),
});

export const updateMemberRoleSchema = z.object({
   role: z.enum(['ADMIN', 'MEMBER']),
});

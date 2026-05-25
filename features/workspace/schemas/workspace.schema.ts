import z from 'zod';

const nameField = z.string().min(1, 'Name is required').max(64);

const slugField = z
   .string()
   .min(1, 'Slug is required')
   .max(64)
   .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers and hyphens');

const descriptionField = z.string().max(256).optional();

export const createWorkspaceSchema = z.object({
   name: nameField,
   slug: slugField,
   description: descriptionField,
});

export const updateWorkspaceSchema = z.object({
   name: nameField.optional(),
   description: descriptionField,
});

import z from 'zod';

const nameField = z.string().min(1, 'Name is required').max(64);
const descriptionField = z.string().max(256).optional();

export const createProjectSchema = z.object({
   name: nameField,
   description: descriptionField,
});

export const updateProjectSchema = z.object({
   name: nameField.optional(),
   description: descriptionField,
});

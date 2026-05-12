import z from 'zod';

const loginSchema = z.object({
   email: z
      .email({ error: 'Please enter a valid email address' })
      .trim()
      .toLowerCase(),

   password: z
      .string({ error: 'Password is required' })
      .min(1, { error: 'Password is required' }),
});

type LoginSchema = z.infer<typeof loginSchema>;

export { loginSchema, type LoginSchema };

import z from 'zod';

const PASSWORD_MIN_LENGTH = 6;

const registerSchema = z
   .object({
      fullName: z
         .string()
         .trim()
         .min(1, { error: 'Full name is required' })
         .max(100, { error: 'Full name cannot exceed 100 characters' }),

      email: z
         .email({ error: 'Please enter a valid email address' })
         .trim()
         .toLowerCase(),

      password: z
         .string({ error: 'Password is required' })
         .min(PASSWORD_MIN_LENGTH, {
            error: `Password should be at least ${PASSWORD_MIN_LENGTH} characters`,
         })
         .max(128, {
            error: 'Password cannot exceed 128 characters',
         })
         .regex(/[A-Z]/, {
            error: 'Password must contain at least one uppercase letter',
         })
         .regex(/[a-z]/, {
            error: 'Password must contain at least one lowercase letter',
         })
         .regex(/[0-9]/, {
            error: 'Password must contain at least one number',
         }),

      confirmPassword: z.string({ error: 'Please confirm your password' }),
   })
   .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      error: 'Passwords do not match',
   });

type RegisterSchema = z.infer<typeof registerSchema>;

export { registerSchema, type RegisterSchema };

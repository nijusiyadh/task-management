'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldError } from '@/components/shared';
import { ROUTES } from '@/constants/routes';
import { registerUser } from '@/features/auth/api';
import { registerSchema, type RegisterSchema } from '@/features/auth/schemas';

import { AuthCard } from './auth-card';
import { PasswordInput } from './password-input';

const inputIconClass =
   'absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none';

function RegisterForm() {
   const router = useRouter();

   const {
      control,
      handleSubmit,
      formState: { isSubmitting },
   } = useForm<RegisterSchema>({
      resolver: zodResolver(registerSchema),
   });

   const onSubmit = async (data: RegisterSchema) => {
      const { error } = await registerUser({
         fullName: data.fullName,
         email: data.email,
         password: data.password,
      });

      if (error) {
         toast.error(error.message ?? 'Something went wrong.');
         return;
      }

      toast.success('Account created successfully.');
      router.replace(ROUTES.home.path);
   };

   return (
      <AuthCard
         title="Create an account"
         description="Enter your details below to create your account and get started."
         footer={
            <p>
               Already have an account?{' '}
               <Link
                  replace
                  href={ROUTES.login.path}
                  className="font-medium text-foreground underline-offset-4 hover:underline">
                  Sign in
               </Link>
            </p>
         }>
         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
               control={control}
               name="fullName"
               render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1.5">
                     <Label htmlFor="fullName">Full Name</Label>
                     <div className="relative">
                        <User className={inputIconClass} />
                        <Input
                           {...field}
                           id="fullName"
                           type="text"
                           placeholder="John Doe"
                           className="pl-9"
                           aria-invalid={!!fieldState.error}
                        />
                     </div>
                     <FieldError message={fieldState.error?.message} />
                  </div>
               )}
            />

            <Controller
               control={control}
               name="email"
               render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1.5">
                     <Label htmlFor="email">Email Address</Label>
                     <div className="relative">
                        <Mail className={inputIconClass} />
                        <Input
                           {...field}
                           id="email"
                           type="email"
                           placeholder="you@example.com"
                           className="pl-9"
                           aria-invalid={!!fieldState.error}
                        />
                     </div>
                     <FieldError message={fieldState.error?.message} />
                  </div>
               )}
            />

            <Controller
               control={control}
               name="password"
               render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1.5">
                     <Label htmlFor="password">Password</Label>
                     <PasswordInput
                        {...field}
                        id="password"
                        placeholder="Min. 6 characters"
                        aria-invalid={!!fieldState.error}
                     />
                     <FieldError message={fieldState.error?.message} />
                  </div>
               )}
            />

            <Controller
               control={control}
               name="confirmPassword"
               render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1.5">
                     <Label htmlFor="confirmPassword">Confirm Password</Label>
                     <PasswordInput
                        {...field}
                        id="confirmPassword"
                        placeholder="Re-enter your password"
                        aria-invalid={!!fieldState.error}
                     />
                     <FieldError message={fieldState.error?.message} />
                  </div>
               )}
            />

            <Button
               size="lg"
               type="submit"
               loading={isSubmitting}
               className="mt-2 w-full hover:cursor-pointer">
               {isSubmitting ? 'Creating...' : 'Create account'}
            </Button>
         </form>
      </AuthCard>
   );
}

export { RegisterForm };

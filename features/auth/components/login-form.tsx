'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldError } from '@/components/shared';
import { ROUTES } from '@/constants/routes';
import { signInUser } from '@/features/auth/api';
import { loginSchema, type LoginSchema } from '@/features/auth/schemas';

import { AuthCard } from './auth-card';
import { PasswordInput } from './password-input';

const inputIconClass =
   'absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none';

function LoginForm() {
   const router = useRouter();

   const {
      control,
      handleSubmit,
      formState: { isSubmitting },
   } = useForm<LoginSchema>({
      resolver: zodResolver(loginSchema),
   });

   const onSubmit = async (data: LoginSchema) => {
      const { error } = await signInUser(data);

      if (error) {
         toast.error(error.message ?? 'Failed to login user');
         return;
      }

      toast.success('Logged in successfully.');
      router.replace(ROUTES.home.path);
   };

   return (
      <AuthCard
         title="Welcome back"
         description="Enter your credentials to access your account."
         footer={
            <p>
               Don&apos;t have an account?{' '}
               <Link
                  replace
                  href={ROUTES.register.path}
                  className="font-medium text-foreground underline-offset-4 hover:underline">
                  Sign up
               </Link>
            </p>
         }>
         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                     <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                           href="#"
                           className="text-xs text-muted-foreground underline-offset-4 hover:underline">
                           Forgot password?
                        </Link>
                     </div>
                     <PasswordInput
                        {...field}
                        id="password"
                        placeholder="Enter your password"
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
               {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
         </form>
      </AuthCard>
   );
}

export { LoginForm };

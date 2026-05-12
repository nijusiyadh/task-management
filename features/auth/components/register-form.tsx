'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerSchema, type RegisterSchema } from '@/features/auth/schemas';

import { FieldError } from '@/components/shared';

import { AuthCard } from './auth-card';

function RegisterForm() {
   const { control, handleSubmit } = useForm<RegisterSchema>({
      resolver: zodResolver(registerSchema),
   });

   const onSubmit = async () => {
      // TODO: wire up to auth API
   };

   return (
      <AuthCard
         title="Create an account"
         description="Enter your details below to create your account and get started.">
         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Controller
               control={control}
               name="email"
               render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1.5">
                     <Label htmlFor="email">Email Address</Label>
                     <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        aria-invalid={!!fieldState.error}
                     />
                     <FieldError message={fieldState.error?.message} />
                  </div>
               )}
            />

            <Controller
               control={control}
               name="fullName"
               render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1.5">
                     <Label htmlFor="fullName">Full Name</Label>
                     <Input
                        {...field}
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        aria-invalid={!!fieldState.error}
                     />
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
                     <Input
                        {...field}
                        id="password"
                        type="password"
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
                     <Input
                        {...field}
                        id="confirmPassword"
                        type="password"
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
               className="w-full hover:cursor-pointer">
               Create account
            </Button>
         </form>
      </AuthCard>
   );
}

export { RegisterForm };

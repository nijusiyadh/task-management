import { authClient } from '@/infrastructure/auth/better-auth/client';

async function registerUser(data: {
   fullName: string;
   email: string;
   password: string;
}) {
   return await authClient.signUp.email({
      name: data.fullName,
      email: data.email,
      password: data.password,
   });
}

async function signInUser(data: { email: string; password: string }) {
   return await authClient.signIn.email({
      email: data.email,
      password: data.password,
   });
}

export { registerUser, signInUser };

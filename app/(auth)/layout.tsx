import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
   return (
      <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-muted/60 via-background to-muted/40 px-4 py-12">
         {children}
      </main>
   );
}

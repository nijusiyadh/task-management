import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import { Urbanist, Geist } from 'next/font/google';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/features/auth/context';
import { QueryProvider } from '@/providers/query-provider';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const urbanist = Urbanist({
   subsets: ['latin'],
   weight: ['400', '500', '600', '700', '900'],
   variable: '--font-urbanist',
});

export const metadata: Metadata = {
   title: 'Task Management',
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html
         lang="en"
         className={cn(urbanist.variable, geist.variable, 'font-sans')}>
         <body className="min-h-full flex flex-col">
            <QueryProvider>
               <AuthProvider>{children}</AuthProvider>
            </QueryProvider>
            <Toaster richColors position="top-right" />
         </body>
      </html>
   );
}

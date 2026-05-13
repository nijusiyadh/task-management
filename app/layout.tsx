import type { Metadata } from 'next';
import { Urbanist, Geist } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';

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
            {children}
            <Toaster richColors position="top-right" />
         </body>
      </html>
   );
}

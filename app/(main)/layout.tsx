import type { ReactNode } from 'react';

import { Header } from '@/components/layout';

export default function MainLayout({ children }: { children: ReactNode }) {
   return (
      <>
         <Header />
         <main className="mx-auto w-full font-urbanist max-w-360 px-6 py-6">
            {children}
         </main>
      </>
   );
}

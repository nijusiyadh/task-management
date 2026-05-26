import type { ReactNode } from 'react';

import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function MainLayout({ children }: { children: ReactNode }) {
   return (
      <SidebarProvider>
         <AppSidebar />
         <SidebarInset>
            <Header />
            <div className="w-full px-6 py-6 font-urbanist">{children}</div>
         </SidebarInset>
      </SidebarProvider>
   );
}

'use client';

import { FolderKanban, LayoutDashboard, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ROUTES } from '@/constants/routes';
import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarRail,
} from '@/components/ui/sidebar';

const NAV_ITEMS = [
   { label: 'Workspaces', icon: LayoutDashboard, href: ROUTES.home.path },
   { label: 'Projects', icon: FolderKanban, href: ROUTES.projects.path },
   { label: 'Members', icon: Users, href: ROUTES.members.path },
   { label: 'Settings', icon: Settings, href: ROUTES.settings.path },
];

export function AppSidebar() {
   const pathname = usePathname();

   return (
      <Sidebar collapsible="icon">
         <SidebarHeader className="h-14 border-b px-4 justify-center">
            <div className="flex items-center gap-2 font-semibold">
               <span className="text-primary text-lg">⬡</span>
               <span className="font-urbanist tracking-tight group-data-[collapsible=icon]:hidden">
                  Taskly
               </span>
            </div>
         </SidebarHeader>

         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {NAV_ITEMS.map(({ label, icon: Icon, href }) => (
                        <SidebarMenuItem key={href}>
                           <SidebarMenuButton
                              render={<Link href={href} />}
                              isActive={pathname === href}
                              tooltip={label}>
                              <Icon />
                              <span className="font-urbanist">{label}</span>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>

         <SidebarRail />
      </Sidebar>
   );
}

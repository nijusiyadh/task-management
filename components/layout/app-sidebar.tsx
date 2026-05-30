'use client';

import { LayoutDashboard, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ROUTES } from '@/constants/routes';
import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarRail,
} from '@/components/ui/sidebar';

const MAIN_NAV = [
   { label: 'Workspaces', icon: LayoutDashboard, href: ROUTES.workspaces.path },
];

function useWorkspaceSlug(): string | null {
   const pathname = usePathname();
   const match = pathname.match(/^\/workspaces\/([^/]+)/);
   return match ? match[1] : null;
}

export function AppSidebar() {
   const pathname = usePathname();
   const workspaceSlug = useWorkspaceSlug();

   const workspaceNav = workspaceSlug
      ? [
           {
              label: 'Overview',
              icon: LayoutDashboard,
              href: ROUTES.workspace(workspaceSlug).path,
           },
           {
              label: 'Members',
              icon: Users,
              href: ROUTES.workspaceMembers(workspaceSlug).path,
           },
           {
              label: 'Settings',
              icon: Settings,
              href: ROUTES.workspaceSettings(workspaceSlug).path,
           },
        ]
      : null;

   return (
      <Sidebar collapsible="icon">
         <SidebarHeader className="h-14 justify-center border-b px-4">
            <div className="flex items-center gap-2 font-semibold">
               <span className="text-lg text-primary">⬡</span>
               <span className="font-urbanist tracking-tight group-data-[collapsible=icon]:hidden">
                  Taskly
               </span>
            </div>
         </SidebarHeader>

         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {MAIN_NAV.map(({ label, icon: Icon, href }) => (
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

            {workspaceNav && (
               <SidebarGroup>
                  <SidebarGroupLabel className="font-urbanist text-xs">
                     Workspace
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                     <SidebarMenu>
                        {workspaceNav.map(({ label, icon: Icon, href }) => (
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
            )}
         </SidebarContent>

         <SidebarRail />
      </Sidebar>
   );
}

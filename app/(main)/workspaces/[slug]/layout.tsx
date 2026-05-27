import type { ReactNode } from 'react';

import { WorkspaceProvider } from '@/features/workspace/context/workspace-context';

interface WorkspaceLayoutProps {
   children: ReactNode;
   params: Promise<{ slug: string }>;
}

export default async function WorkspaceLayout({
   children,
   params,
}: WorkspaceLayoutProps) {
   const { slug } = await params;

   return <WorkspaceProvider slug={slug}>{children}</WorkspaceProvider>;
}

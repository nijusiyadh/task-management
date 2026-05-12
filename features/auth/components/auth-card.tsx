import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface AuthCardProps {
   children: ReactNode;
   title?: string;
   description?: string;
   className?: string;
}

function AuthCard({ children, title, description, className }: AuthCardProps) {
   return (
      <Card
         size="default"
         className={cn('w-full max-w-lg font-urbanist', className)}>
         {(title || description) && (
            <CardHeader className="w-full items-center text-center">
               {title && (
                  <CardTitle className="font-semibold font-urbanist text-2xl!">
                     {title}
                  </CardTitle>
               )}
               {description && (
                  <CardDescription className="text-center text-base!">
                     {description}
                  </CardDescription>
               )}
            </CardHeader>
         )}
         <CardContent>{children}</CardContent>
      </Card>
   );
}

export { AuthCard };


"use client";

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { UserNav } from '@/components/auth/user-nav';
import { Loader2, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  SidebarProvider,
  SidebarInset,
  SidebarTrigger
} from '@/components/ui/sidebar';

function RestrictedContent() {
  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <CreditCard />
          Activate Your Account to Access This Feature
        </CardTitle>
        <CardDescription>
          This tool is exclusively available for active members. Please activate your plan to unlock this and all other features.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/dashboard/upgrade">Activate Your Plan</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading, updateUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // One-time redirect for newly activated family members
  useEffect(() => {
    if (user?.isNewlyActivatedFamily) {
      // Immediately update the state to clear the flag and prevent loops
      updateUser({ isNewlyActivatedFamily: false });
      // Redirect to the guide
      router.push('/dashboard/strategy-center/connecting-your-domain');
    }
  }, [user, updateUser, router]);


  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Determine access rights
  const hasAccess = user.isPaid || user.isFriendAndFamily;
  const isAdmin = user.email === 'rentapog@gmail.com';

  // List of pages that are always accessible regardless of payment status
  const alwaysAllowedPaths = [
      '/dashboard',
      '/dashboard/upgrade',
      '/dashboard/settings',
      '/dashboard/request-refund'
  ];

  // Admin pages have their own layout and protection, so we ignore them here
  const isAnAdminPath = pathname.startsWith('/dashboard/admin');

  // Check if the current page is one of the always allowed ones
  const isAllowedPath = alwaysAllowedPaths.some(path => pathname.startsWith(path));

  let content = children;
  
  // If user does not have access, is not an admin, and is trying to access a restricted page...
  if (!hasAccess && !isAdmin && !isAllowedPath && !isAnAdminPath) {
      // ...show the restricted content message instead of the page content.
      content = <RestrictedContent />;
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <SidebarTrigger className="md:hidden"/>
          <div className="ml-auto flex items-center gap-2">
            <UserNav />
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-4 md:gap-8">
            {content}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

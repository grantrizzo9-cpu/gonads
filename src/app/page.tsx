
import { Suspense } from 'react';
import { DomainRouter } from '@/components/domain-router';
import { HomePageClient } from '@/components/home-page-client';
import { Loader2 } from 'lucide-react';

export default function Page() {
  return (
    <Suspense fallback={
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    }>
        <DomainRouter 
            fallback={<HomePageClient />} 
        />
    </Suspense>
  );
}

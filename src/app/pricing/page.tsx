
import { Suspense } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PricingClientPage } from './pricing-client-page';
import { Skeleton } from '@/components/ui/skeleton';

function PricingPageSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col space-y-4 rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-5 w-full" />
                <div className="flex-grow space-y-3 pt-4">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                </div>
                <Skeleton className="h-10 w-full mt-4" />
            </div>
             <div className="flex flex-col space-y-4 rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-5 w-full" />
                <div className="flex-grow space-y-3 pt-4">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                </div>
                <Skeleton className="h-10 w-full mt-4" />
            </div>
             <div className="flex flex-col space-y-4 rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-5 w-full" />
                <div className="flex-grow space-y-3 pt-4">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                </div>
                <Skeleton className="h-10 w-full mt-4" />
            </div>
        </div>
    );
}

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="container px-4 sm:px-6 py-12 md:py-24">
            <div className="mx-auto mb-12 max-w-3xl text-center">
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
                Find Your Edge. Start Earning Daily.
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                Pay a one-time activation fee to start your 3-day free trial. After the trial, your daily plan fee is covered by the platform's 30% share from just two of your referrals, putting you in profit mode immediately.
                </p>
            </div>

            <Suspense fallback={<PricingPageSkeleton />}>
                <PricingClientPage />
            </Suspense>

            <div className="mt-12 text-center text-muted-foreground">
                <p><strong>Commission Structure:</strong> All plans start at a 70% recurring daily commission rate. <br /> Automatically upgrade to <strong>75%</strong> upon reaching 10 active referrals.</p>
            </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

'use client';

import { useState, useEffect, Suspense } from 'react';
import { getWebsiteForDomain, type SavedWebsite } from '@/lib/firestore';
import { HomePageClient } from '@/components/home-page-client';
import { Loader2 } from 'lucide-react';

export default function Page() {
    const [website, setWebsite] = useState<SavedWebsite | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkDomain = async () => {
            try {
                // This code now runs on the client, so window.location is available
                let domain = window.location.hostname.split(':')[0] || '';
                
                console.log(`[Client Domain Router] Detected host: ${domain}`);
                
                // Strip 'www.' from the beginning of the domain for lookup
                if (domain.startsWith('www.')) {
                    domain = domain.substring(4);
                }
                
                // We check for localhost to ensure the marketing page works in local dev.
                // Also check for the app hosting preview URL.
                if (domain === 'localhost' || domain.endsWith('.a.run.app') || domain.endsWith('web.app') || domain.endsWith('firebaseapp.com')) {
                    setLoading(false);
                    return;
                }
                
                const site = await getWebsiteForDomain(domain);

                if (site && site.htmlContent) {
                    console.log(`[Client Domain Router] Found website with theme '${site.themeName}' for domain: ${domain}`);
                    setWebsite(site);
                } else {
                    console.log(`[Client Domain Router] No website found for domain: ${domain}. Showing default marketing page.`);
                }
            } catch (e: any) {
                console.error("[Client Domain Router] Error checking domain:", e);
                setError(e.message || "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        checkDomain();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    if (error) {
         return (
            <div className="flex h-screen w-full items-center justify-center text-center p-4">
                <div>
                    <h1 className="text-2xl font-bold text-destructive">An Error Occurred</h1>
                    <p className="text-muted-foreground mt-2">Could not determine which site to load.</p>
                    <pre className="mt-4 text-sm bg-muted p-2 rounded">{error}</pre>
                </div>
            </div>
        );
    }

    if (website && website.htmlContent) {
        // If a website is found, serve its raw HTML content inside a sandboxed iframe.
        return <iframe 
            srcDoc={website.htmlContent} 
            title={website.themeName}
            style={{ width: '100%', height: '100vh', border: 'none' }}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />;
    }

    // If no website is mapped, show the main marketing page, wrapped in Suspense.
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <HomePageClient />
        </Suspense>
    );
}

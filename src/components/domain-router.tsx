
'use client';

import { useState, useEffect } from 'react';
import { getWebsiteForDomain, type SavedWebsite } from '@/lib/firestore';
import { Loader2 } from 'lucide-react';

export function DomainRouter({ fallback }: { fallback: React.ReactNode }) {
    const [website, setWebsite] = useState<SavedWebsite | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkDomain = async () => {
            try {
                let domain = window.location.hostname.split(':')[0] || '';
                
                if (domain.startsWith('www.')) {
                    domain = domain.substring(4);
                }
                
                if (domain === 'localhost' || domain.endsWith('.a.run.app') || domain.endsWith('web.app') || domain.endsWith('firebaseapp.com')) {
                    setLoading(false);
                    return; // Will render fallback
                }
                
                const site = await getWebsiteForDomain(domain);

                if (site && site.htmlContent) {
                    setWebsite(site);
                }
            } catch (e: any) {
                console.error("[DomainRouter] Error checking domain:", e);
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
        return <iframe 
            srcDoc={website.htmlContent} 
            title={website.themeName || 'Website'}
            style={{ width: '100%', height: '100vh', border: 'none' }}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />;
    }

    // If no site, or still loading, or localhost, render the fallback (HomePageClient)
    return fallback;
}

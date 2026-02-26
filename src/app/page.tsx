
// This is a new server component that acts as a router
import { headers } from 'next/headers';
import { getWebsiteForDomain } from '@/lib/firestore';
import { HomePageClient } from '@/components/home-page-client';

export default async function Page() {
    const headersList = headers();
    // In a real environment, you might check x-forwarded-host as well.
    // For Firebase App Hosting, 'host' should be reliable.
    let domain = headersList.get('host')?.split(':')[0] || '';
    
    // Add a log to see what the server is seeing
    console.log(`[Domain Router] Detected host: ${domain}`);
    
    // Strip 'www.' from the beginning of the domain for lookup
    if (domain.startsWith('www.')) {
        domain = domain.substring(4);
    }
    
    // We check for localhost to ensure the marketing page works in local dev.
    if (domain === 'localhost') {
        return <HomePageClient />;
    }
    
    // For any other domain, we try to find a mapped website.
    const website = await getWebsiteForDomain(domain);

    if (website && website.htmlContent) {
        // If a website is found for the domain, serve its raw HTML content.
        console.log(`[Domain Router] Found website with theme '${website.themeName}' for domain: ${domain}`);
        return <div dangerouslySetInnerHTML={{ __html: website.htmlContent }} />;
    }

    console.log(`[Domain Router] No website found for domain: ${domain}. Showing default marketing page.`);
    // If no website is mapped to the domain, it's either the main marketing
    // site or an unconfigured custom domain. We'll show the main marketing page.
    return <HomePageClient />;
}

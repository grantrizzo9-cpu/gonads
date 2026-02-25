'use client';

import { useState } from 'react';
import { useAuth } from "@/components/auth/auth-provider";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Globe, Info } from 'lucide-react';


export default function HostingPage() {
    const { user } = useAuth();
    const [domainName, setDomainName] = useState('rizzosaipro.com');
    const cnameValue = user?.username ? `${user.username}.hostproai.com` : `[your-username].hostproai.com`;

    const handleCheckDns = () => {
        if (!domainName) return;
        const url = `https://dnschecker.org/#A/${domainName}`;
        window.open(url, '_blank');
    };

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline"><Globe />Connect a Custom Domain</CardTitle>
                <CardDescription>
                    Follow these steps to point your custom domain to our servers.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                 <div>
                    <h3 className="font-semibold text-lg mb-2">Step 1: Configure DNS Records</h3>
                    <p className="text-muted-foreground mb-4">
                        Log in to your domain registrar (e.g., GoDaddy, Namecheap) and add the following three DNS records. Some registrars use '@' for the root domain. If you need to purchase a domain, you can do so from our domain registrar <a href="https://rizzosai.shopco.com/" target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline">Rizzo's Domains</a>.
                    </p>
                    <ul className="list-none mb-4 space-y-2 bg-muted p-4 rounded-lg font-mono text-sm">
                        <li><strong>A Record 1:</strong> Host: @, Value: 199.36.158.100</li>
                        <li><strong>A Record 2:</strong> Host: @, Value: 199.36.158.101</li>
                        <li><strong>CNAME Record:</strong> Host: www, Value: {cnameValue}</li>
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg mb-2">Step 2: Verify DNS Propagation</h3>
                     <p className="text-muted-foreground mb-4">
                        After adding your DNS records, it can take some time for them to take effect globally. Use the tool below to check the status. Once you see our server IPs listed worldwide for your 'A' records, you can proceed to the final step.
                    </p>
                     <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                        <Input
                            placeholder="your-domain.com"
                            value={domainName}
                            onChange={(e) => setDomainName(e.target.value.trim())}
                        />
                        <Button onClick={handleCheckDns} className="w-full sm:w-auto">
                            Check DNS Status
                        </Button>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-2">Step 3: Link Domain in Firebase</h3>
                     <Alert variant="default" className="border-primary border-2">
                        <Info className="h-4 w-4 text-primary" />
                        <AlertTitle className="font-bold text-lg text-primary">This is the Final Step!</AlertTitle>
                        <AlertDescription>
                           <p className="font-bold text-base text-foreground">Seeing the "Site Not Found" page is a GOOD thing. It means your domain is pointing to Firebase correctly.</p>
                           <p className="mt-2">You now need to tell Firebase to use your domain. This is a one-time setup that I can't do for you, but it's quick:</p>
                           <ol className="list-decimal list-inside my-4 space-y-2 font-medium">
                                <li>
                                    Click here to open the 
                                    <a href="https://console.firebase.google.com/project/_/hosting/main" target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline px-1">
                                        Firebase Hosting Console
                                    </a>.
                                </li>
                                <li>Click the big <strong>"Add custom domain"</strong> button.</li>
                                <li>In the box that appears, type: <strong>{domainName || 'your-domain.com'}</strong></li>
                                <li>Follow the simple steps to verify. Firebase will then connect your site.</li>
                           </ol>
                           <p>This will make your website live. It can sometimes take a few minutes for the SSL certificate to be ready.</p>
                        </AlertDescription>
                    </Alert>
                </div>
            </CardContent>
        </Card>
    );
}

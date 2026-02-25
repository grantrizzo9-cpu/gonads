'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Link as LinkIcon } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function HostingPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [domainName, setDomainName] = useState('');

    const cnameValue = user?.username ? `${user.username}.hostproai.com` : `[your-username].hostproai.com`;

    const handleVerify = () => {
        if (!domainName) {
            toast({
                title: "Please enter a domain name",
                description: "You need to enter the domain you are trying to connect.",
                variant: "destructive"
            });
            return;
        }

        toast({
            title: "Opening DNS Checker...",
            description: `You can now check the live propagation status for ${domainName}.`,
        });

        // Open dnschecker.org for both A and CNAME records in new tabs.
        setTimeout(() => {
            window.open(`https://dnschecker.org/#A/${domainName}`, '_blank');
            window.open(`https://dnschecker.org/#CNAME/www.${domainName}`, '_blank');
        }, 500);
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Globe />Connect a Custom Domain</CardTitle>
                    <CardDescription>Follow these steps to point your custom domain to our servers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">Step 1: Add DNS Records at Your Registrar</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Log in to your domain registrar (e.g., GoDaddy, Namecheap) and add the following three DNS records. Some registrars use '@' for the root domain. If you need to purchase a domain, you can do so from our domain registrar <a href="https://rizzosai.shopco.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Rizzo's Domains</a>.
                        </p>
                        <div className="p-4 border rounded-lg bg-muted space-y-3 text-sm font-mono">
                           <p><strong>A Record 1:</strong> Host: @ Value: 199.36.158.100</p>
                           <p><strong>A Record 2:</strong> Host: @ Value: 199.36.158.101</p>
                           <p><strong>CNAME Record:</strong> Host: www Value: {cnameValue}</p>
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold mt-6 mb-2">Step 2: Verify Your DNS Propagation</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                           After adding the records, enter your domain name below. We will use a trusted external tool to show you the live status of your DNS changes across the globe.
                        </p>
                        <div className="flex gap-2 max-w-md">
                            <Input 
                                placeholder="your-domain.com" 
                                value={domainName}
                                onChange={(e) => setDomainName(e.target.value.trim())}
                            />
                            <Button onClick={handleVerify}>Verify DNS Settings</Button>
                        </div>
                         <Alert className="mt-4 max-w-md">
                            <LinkIcon className="h-4 w-4" />
                            <AlertTitle>How Verification Works</AlertTitle>
                            <AlertDescription>
                                We use <a href="https://dnschecker.org/" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">DNS Checker</a> to provide a real-time view of your domain's status. When you click verify, we'll open new tabs for you to see if your A and CNAME records have propagated. Your site is live when you see green checkmarks across the map.
                            </AlertDescription>
                        </Alert>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

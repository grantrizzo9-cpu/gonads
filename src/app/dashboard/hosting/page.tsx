'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";

export default function HostingPage() {
    const { user } = useAuth();
    const cnameValue = user?.username ? `${user.username}.hostproai.com` : `[your-username].hostproai.com`;

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Globe />Connect a Custom Domain</CardTitle>
                    <CardDescription>Follow these steps to point your custom domain to our servers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Log in to your domain registrar (e.g., GoDaddy, Namecheap) and add the following three DNS records. Some registrars use '@' for the root domain. If you need to purchase a domain, you can do so from our domain registrar <a href="https://rizzosai.shopco.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Rizzo's Domains</a>.
                        </p>
                        <div className="p-4 border rounded-lg bg-muted space-y-3 text-sm font-mono">
                           <p><strong>A Record 1:</strong> Host: @ Value: 199.36.158.100</p>
                           <p><strong>A Record 2:</strong> Host: @ Value: 199.36.158.101</p>
                           <p><strong>CNAME Record:</strong> Host: www Value: {cnameValue}</p>
                        </div>
                         <p className="text-sm text-muted-foreground mt-4">
                            After adding these records, it can take up to an hour for them to take effect globally. You can check the status using a tool like <a href="https://dnschecker.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">DNS Checker</a>. Once propagation is complete, your site will be live.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

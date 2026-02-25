'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Loader2, Circle, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

type VerificationStatus = 'idle' | 'verifying' | 'success' | 'error';
interface DnsCheck {
  record: 'A' | 'CNAME';
  host: string;
  status: 'ok' | 'fail' | 'pending';
}

export default function HostingPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [domainName, setDomainName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
    const [dnsChecks, setDnsChecks] = useState<DnsCheck[]>([
        { record: 'A', host: '@', status: 'pending' },
        { record: 'A', host: '@', status: 'pending' },
        { record: 'CNAME', host: 'www', status: 'pending' },
    ]);
    const [error, setError] = useState<string | null>(null);

    const cnameValue = user?.username ? `${user.username}.hostproai.com` : `[your-username].hostproai.com`;

    const handleVerify = () => {
        if (!domainName) {
            toast({
                title: "Please enter a domain name",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        setVerificationStatus('verifying');
        setError(null);

        // Simulate the check
        setTimeout(() => {
            setIsLoading(false);
            if (domainName.toLowerCase() === 'success-domain.com' || domainName.toLowerCase() === 'rizzosaipro.com') {
                setVerificationStatus('success');
                setDnsChecks([
                    { record: 'A', host: '@', status: 'ok' },
                    { record: 'A', host: '@', status: 'ok' },
                    { record: 'CNAME', host: 'www', status: 'ok' },
                ]);
                toast({ title: 'Success!', description: `${domainName} is now connected.`});
            } else {
                setVerificationStatus('error');
                setError('Some DNS records are missing or incorrect.');
                setDnsChecks([
                    { record: 'A', host: '@', status: 'fail' },
                    { record: 'A', host: '@', status: 'fail' },
                    { record: 'CNAME', host: 'www', status: 'fail' },
                ]);
                toast({ title: 'Verification Failed', description: `Could not verify DNS records for ${domainName}.`, variant: 'destructive'});
            }
        }, 1500);
    };

    const DnsStatusIcon = ({ status }: { status: DnsCheck['status'] }) => {
        if (status === 'ok') return <CheckCircle2 className="h-5 w-5 text-green-500" />;
        if (status === 'fail') return <XCircle className="h-5 w-5 text-destructive" />;
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Globe />Connect a New Domain</CardTitle>
                    <CardDescription>Enter a domain below to verify it's pointing correctly to our servers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex gap-2 max-w-md">
                        <Input 
                            placeholder="your-domain.com" 
                            value={domainName}
                            onChange={(e) => setDomainName(e.target.value.trim())}
                            disabled={isLoading}
                        />
                        <Button onClick={handleVerify} disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify Domain'}
                        </Button>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        For this demo, try entering 'success-domain.com' to see a successful verification. Any other domain will show an error.
                    </p>

                    {verificationStatus === 'error' && (
                        <div className="space-y-4">
                            <Alert variant="destructive">
                                <XCircle className="h-4 w-4" />
                                <AlertTitle>Configuration Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                             <Card className="bg-muted/50">
                                 <CardHeader>
                                    <CardTitle className="text-base">DNS Records to Add</CardTitle>
                                    <CardDescription>Log in to your domain registrar (e.g., GoDaddy, Namecheap) and add these records. You can purchase a domain from our registrar <a href="https://rizzosai.shopco.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Rizzo's Domains</a>.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 text-sm font-mono space-y-2">
                                   <p><strong>A Record 1:</strong> Host: @, Value: 199.36.158.100</p>
                                   <p><strong>A Record 2:</strong> Host: @, Value: 199.36.158.101</p>
                                   <p><strong>CNAME Record:</strong> Host: www, Value: {cnameValue}</p>
                                </CardContent>
                             </Card>
                        </div>
                    )}
                    
                    {(verificationStatus === 'verifying' || verificationStatus === 'error') && (
                         <Card>
                            <CardHeader>
                                <CardTitle className="text-base">DNS Check Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {dnsChecks.map((check, index) => (
                                        <li key={index} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-3">
                                                <DnsStatusIcon status={isLoading ? 'pending' : check.status} />
                                                <span className={cn("font-medium", check.status === 'fail' && !isLoading && "text-destructive")}>
                                                    {check.record} Record
                                                </span>
                                            </div>
                                            <span className="font-mono text-muted-foreground">{check.host}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                         </Card>
                    )}

                    {verificationStatus === 'success' && (
                         <Alert variant="default" className="bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-300">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <AlertTitle>Verification Successful!</AlertTitle>
                            <AlertDescription>{domainName} is now connected and live.</AlertDescription>
                        </Alert>
                    )}
                    
                </CardContent>
            </Card>
        </div>
    );
}
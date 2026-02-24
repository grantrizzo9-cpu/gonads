'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { HardDrive, ExternalLink, Globe, Loader2, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useDomains } from "@/components/domains/domain-provider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

type DnsStatus = 'idle' | 'checking' | 'connected' | 'error';

type DnsCheckResult = {
    type: 'A' | 'CNAME';
    host: string;
    value: string;
    status: 'ok' | 'missing';
};

export default function HostingPage() {
    const [domainInput, setDomainInput] = useState('');
    const [checkStatus, setCheckStatus] = useState<DnsStatus>('idle');
    const [checkResults, setCheckResults] = useState<DnsCheckResult[]>([]);

    const { domains, addDomain, removeDomain } = useDomains();
    const { toast } = useToast();

    const handleCheckDomain = async () => {
        if (!domainInput) return;
        setCheckStatus('checking');
        setCheckResults([]);

        // This is a simulation. A real implementation would require a backend endpoint to perform DNS lookups.
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Simulate a successful connection
        setCheckResults([
            { type: 'A', host: '@', value: '199.36.158.100', status: 'ok' },
            { type: 'A', host: '@', value: '199.36.158.101', status: 'ok' },
            { type: 'CNAME', host: 'www', value: '[your-username].hostproai.com', status: 'ok' },
        ]);
        setCheckStatus('connected');
        addDomain(domainInput);
        setDomainInput(''); // Clear input after successful connection
        toast({
            title: "Domain Connected!",
            description: `${domainInput} has been successfully verified and added.`,
        });

        // To simulate an error, you could do something like this:
        // setCheckResults([
        //     { type: 'A', host: '@', value: '199.36.158.100', status: 'ok' },
        //     { type: 'A', host: '@', value: '199.36.158.101', status: 'missing' },
        //     { type: 'CNAME', host: 'www', value: '[your-username].hostproai.com', status: 'ok' },
        // ]);
        // setCheckStatus('error');
    };
    
    const handleDisconnectDomain = (domainName: string) => {
        removeDomain(domainName);
        toast({
            title: "Domain Disconnected",
            description: `${domainName} has been removed from your list.`,
            variant: "destructive"
        });
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><HardDrive />Hosting Manager</CardTitle>
                    <CardDescription>Connect and manage your custom domains for your websites.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert>
                        <HardDrive className="h-4 w-4" />
                        <AlertTitle>New to Connecting a Domain?</AlertTitle>
                        <AlertDescription>
                            <p>Our step-by-step guide will walk you through purchasing and connecting a domain in minutes.</p>
                            <Button asChild className="mt-4">
                                <Link href="/strategy-center/connecting-your-domain">
                                    View Domain Connection Guide <ExternalLink className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Globe />Connect a New Domain</CardTitle>
                    <CardDescription>Enter a domain below to verify it's pointing correctly to our servers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2 items-end">
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="domain">Domain Name</Label>
                            <Input
                                id="domain"
                                type="text"
                                placeholder="your-new-domain.com"
                                value={domainInput}
                                onChange={(e) => setDomainInput(e.target.value)}
                                disabled={checkStatus === 'checking'}
                            />
                        </div>
                        <Button onClick={handleCheckDomain} disabled={!domainInput || checkStatus === 'checking'}>
                            {checkStatus === 'checking' ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Verify Domain
                        </Button>
                    </div>
                </CardContent>
                {checkStatus !== 'idle' && (
                    <>
                        <Separator />
                        <CardFooter className="flex flex-col items-start gap-4 pt-6">
                            {checkStatus === 'checking' && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Checking DNS records for {domainInput}...</span>
                                </div>
                            )}

                            {checkStatus === 'connected' && (
                                <div className="w-full space-y-4">
                                    <div className="p-4 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800 flex items-center gap-3">
                                        <CheckCircle className="h-6 w-6"/>
                                        <div>
                                            <h3 className="font-bold">Verification Successful!</h3>
                                            <p className="text-sm">The domain has been added to your list of connected domains below.</p>
                                        </div>
                                    </div>
                                    
                                </div>
                            )}

                             {checkStatus === 'error' && (
                                <div className="w-full space-y-4">
                                     <div className="p-4 rounded-md bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-3">
                                        <XCircle className="h-6 w-6"/>
                                        <div>
                                            <h3 className="font-bold">Configuration Error</h3>
                                            <p className="text-sm">Some DNS records are missing or incorrect. Please review the guide and your registrar settings.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                             {checkResults.length > 0 && (
                                <div className="w-full p-4 border rounded-lg">
                                    <h4 className="font-semibold mb-2">DNS Check Results</h4>
                                    <ul className="space-y-2 text-sm">
                                        {checkResults.map((res, i) => (
                                            <li key={i} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 font-mono text-xs">
                                                    <span className={cn("h-2 w-2 rounded-full", res.status === 'ok' ? 'bg-green-500' : 'bg-red-500')}></span>
                                                    <span className="w-16">{res.type}</span>
                                                    <span className="w-24 text-muted-foreground">{res.host}</span>
                                                    <span>{res.value}</span>
                                                </div>
                                                <span className={cn("text-xs font-bold", res.status === 'ok' ? 'text-green-500' : 'text-red-500')}>
                                                    {res.status === 'ok' ? 'Found' : 'Missing'}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                             )}

                        </CardFooter>
                    </>
                )}
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Connected Domains</CardTitle>
                    <CardDescription>A list of your verified domains on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    {domains.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Domain</TableHead>
                                    <TableHead>Connected On</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {domains.map((domain) => (
                                    <TableRow key={domain.name}>
                                        <TableCell className="font-medium">{domain.name}</TableCell>
                                        <TableCell>{format(new Date(domain.connectedAt), "PPP")}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="destructive" size="sm" onClick={() => handleDisconnectDomain(domain.name)}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Disconnect
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">You have not connected any domains yet.</p>
                    )}
                </CardContent>
            </Card>

        </div>
    );
}


'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HardDrive, ServerOff, PlusCircle, Trash2, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDomains, type Domain } from "@/contexts/domains-provider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/components/auth/auth-provider";
import { getWebsites, getDomainMappingsForUser, setDomainMapping } from "@/lib/firestore";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";


export default function HostingPage() {
    const { domains, addDomain, deleteDomain } = useDomains();
    const { user } = useAuth();
    const { toast } = useToast();
    const [newDomainName, setNewDomainName] = useState("");
    const [websiteCount, setWebsiteCount] = useState(0);
    const [loadingWebsites, setLoadingWebsites] = useState(false);

    // Load website count for Firebase integration hint
    useEffect(() => {
        if (user?.uid) {
            setLoadingWebsites(true);
            getWebsites(user.uid)
                .then(websites => setWebsiteCount(websites.length))
                .catch(err => console.error("Failed to load websites", err))
                .finally(() => setLoadingWebsites(false));
        }
    }, [user?.uid]);

    const handleAddDomain = () => {
        if (newDomainName.trim()) {
            addDomain(newDomainName.trim());
            setNewDomainName("");
        }
    };
    
    const getStatusVariant = (status: Domain['status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
        switch (status) {
            case 'verified':
                return 'secondary';
            case 'pending':
                return 'destructive';
            case 'error':
                return 'destructive';
            default:
                return 'outline';
        }
    }

    return (
        <div className="space-y-8">
            {websiteCount > 0 && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Great! You have {websiteCount} generated website{websiteCount !== 1 ? 's' : ''}. Connect your domains below to make them live!
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><HardDrive/>Hosting Management</CardTitle>
                    <CardDescription>Add your custom domains here to connect them to your generated websites.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
                        <Input 
                            placeholder="e.g., your-cool-site.com" 
                            value={newDomainName}
                            onChange={(e) => setNewDomainName(e.target.value)}
                        />
                        <Button type="button" onClick={handleAddDomain}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Domain
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Your Domains</CardTitle>
                    <CardDescription>A list of all domains you've added to your account.</CardDescription>
                </CardHeader>
                 <CardContent>
                    {domains.length > 0 ? (
                       <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Domain</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {domains.map((domain) => (
                                    <TableRow key={domain.id}>
                                        <TableCell className="font-medium">
                                            <Link href={`/dashboard/domains/${domain.id}`} className="hover:underline">
                                                {domain.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Badge variant={getStatusVariant(domain.status)}>
                                                        {domain.status === 'pending' ? 'Action Required' : 'Awaiting SSL'}
                                                    </Badge>
                                                </TooltipTrigger>
                                                {domain.status === 'verified' && (
                                                    <TooltipContent>
                                                        <p>DNS connected. Waiting for Google to issue the SSL certificate. This can take several hours.</p>
                                                    </TooltipContent>
                                                )}
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/dashboard/domains/${domain.id}`}>
                                                    Manage
                                                </Link>
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="sm">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete your domain configuration.
                                                    </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => deleteDomain(domain.id)}>Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center text-muted-foreground py-16">
                            <ServerOff className="mx-auto h-12 w-12 mb-4"/>
                            <h3 className="text-lg font-semibold">No Domains Added Yet</h3>
                            <p>Use the form above to add your first domain and get it connected.</p>
                        </div>
                    )}
                 </CardContent>
            </Card>
        </div>
    )
}

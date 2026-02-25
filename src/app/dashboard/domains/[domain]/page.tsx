
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from 'lucide-react';
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ManageDomainPage() {
    const params = useParams();
    const domainName = typeof params.domain === 'string' ? decodeURIComponent(params.domain) : '';

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
             <Button variant="ghost" asChild>
                <Link href="/dashboard/domains"><ArrowLeft className="mr-2"/> Back to All Domains</Link>
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2">
                        <Globe />
                        {domainName}
                    </CardTitle>
                    <CardDescription>Manage connection and deployment for this domain.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Domain management interface will be restored here shortly.</p>
                </CardContent>
            </Card>
        </div>
    );
}

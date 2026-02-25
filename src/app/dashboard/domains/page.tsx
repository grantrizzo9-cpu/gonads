
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HardDrive, ServerOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";

export default function DomainsPage() {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><HardDrive/>Domain Management</CardTitle>
                    <CardDescription>Add your custom domains here to connect them to your generated websites.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
                        <Input placeholder="e.g., your-cool-site.com" />
                        <Button type="submit">
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
                    <div className="text-center text-muted-foreground py-16">
                        <ServerOff className="mx-auto h-12 w-12 mb-4"/>
                        <h3 className="text-lg font-semibold">No Domains Added Yet</h3>
                        <p>Use the form above to add your first domain and get it connected.</p>
                    </div>
                 </CardContent>
            </Card>
        </div>
    )
}

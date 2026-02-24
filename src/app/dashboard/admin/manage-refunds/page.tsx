'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ReceiptText } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useReferrals } from "@/components/referrals/referral-provider";

export default function AdminManageRefundsPage() {
    const { referrals } = useReferrals();
    const { toast } = useToast();

    const handleRefund = (email: string) => {
        // In a real app, this would trigger a refund process and update the user's status.
        // For now, we'll just show a confirmation toast.
        toast({
            title: "Refund Processed",
            description: `A refund has been issued for ${email}. Their account should be deactivated.`,
        });
        // Here you would also call a function to change the user's status, e.g., `deactivateUser(email)`
    };

    // We can only refund users who have activated.
    const eligibleForRefund = referrals.filter(r => r.status === 'activated');

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <ShieldAlert />
                    Manage Refunds
                </CardTitle>
                <CardDescription>
                    Review and process refund requests for activated affiliates.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {eligibleForRefund.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Referred User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {eligibleForRefund.map((referral) => (
                                <TableRow key={referral.email}>
                                    <TableCell className="font-medium">{referral.referredUser}</TableCell>
                                    <TableCell>{referral.email}</TableCell>
                                    <TableCell>{referral.plan}</TableCell>
                                    <TableCell>
                                        <Badge variant="default">{referral.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleRefund(referral.email)}
                                        >
                                            Process Refund
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        <ReceiptText className="mx-auto h-12 w-12 mb-4"/>
                        <h3 className="text-lg font-semibold">No Active Users</h3>
                        <p>There are no activated accounts eligible for a refund at this time.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

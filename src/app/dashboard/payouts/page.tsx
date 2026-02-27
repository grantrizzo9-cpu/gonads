import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { payoutHistory } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Wallet } from "lucide-react";

export default function PayoutsPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2"><Wallet/>Payout Settings</CardTitle>
          <CardDescription>Configure your payout details to receive daily commissions. You'll need to connect a mass payout provider like Payoneer or another service that can handle automated daily payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 max-w-md">
             <div>
                <Label htmlFor="payout-email">Payout Method</Label>
                <p className="text-sm text-muted-foreground">To enable automated daily payouts to your affiliates, you must connect a mass payout provider.</p>
             </div>
             <Button disabled>Connect Payout Provider (Coming Soon)</Button>
          </div>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">Services like Payoneer or Wise can handle mass payouts.</p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
          <CardDescription>A log of your recent daily commission payouts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount (AUD)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Transaction ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payoutHistory.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>{payout.date}</TableCell>
                  <TableCell className="font-medium">${payout.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={payout.status === 'Completed' ? 'default' : 'destructive'}>{payout.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">{payout.transactionId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

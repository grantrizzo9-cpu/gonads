'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AdminReferral {
  id: string;
  affiliateUsername: string;
  newUserUsername: string;
  newUserEmail: string;
  createdAt: string;
  referralCountForAffiliate: number;
}

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<AdminReferral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterAffiliate, setFilterAffiliate] = useState<string>('all');
  const [affiliates, setAffiliates] = useState<string[]>([]);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await fetch('/api/admin/get-all-referrals');
        const data = await response.json();
        if (data.success) {
          setReferrals(data.referrals);
          // Extract unique affiliates
          const uniqueAffiliates = [...new Set(data.referrals.map((r: AdminReferral) => r.affiliateUsername))];
          setAffiliates(uniqueAffiliates.sort());
        }
      } catch (error) {
        console.error('Error fetching referrals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  const filteredReferrals = filterAffiliate === 'all'
    ? referrals
    : referrals.filter(r => r.affiliateUsername === filterAffiliate);

  // Get affiliates with 2+ referrals (profitable)
  const profitableAffiliates = affiliates.filter(affiliate => {
    const count = referrals.filter(r => r.affiliateUsername === affiliate).length;
    return count >= 2;
  });

  // Get affiliates with exactly 2 referrals (newly profitable)
  const newlyProfitable = affiliates.filter(affiliate => {
    const count = referrals.filter(r => r.affiliateUsername === affiliate).length;
    return count === 2;
  });

  // Get affiliates with 1 referral (at-risk for chargeback)
  const atRiskAffiliates = affiliates.filter(affiliate => {
    const count = referrals.filter(r => r.affiliateUsername === affiliate).length;
    return count === 1;
  });

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900">
            <AlertTriangle className="w-5 h-5" />
            Chargeback Risk Summary
          </CardTitle>
          <CardDescription className="text-red-700">
            Affiliates at 1 referral are unprofitable and at risk for chargebacks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-red-700">At-Risk (1 Referral)</p>
              <p className="text-3xl font-bold text-red-900">{atRiskAffiliates.length}</p>
              <p className="text-xs text-red-700 mt-1">
                {atRiskAffiliates.length > 0 ? atRiskAffiliates.join(', ') : 'None'}
              </p>
            </div>
            <div>
              <p className="text-sm text-orange-700">Newly Profitable</p>
              <p className="text-3xl font-bold text-orange-800">{newlyProfitable.length}</p>
              <p className="text-xs text-orange-700 mt-1">
                {newlyProfitable.length > 0 ? newlyProfitable.join(', ') : 'None'}
              </p>
            </div>
            <div>
              <p className="text-sm text-green-700">Profitable (2+)</p>
              <p className="text-3xl font-bold text-green-900">{profitableAffiliates.length}</p>
              <p className="text-xs text-green-700 mt-1">
                Total profitable affiliates
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Referrals Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Affiliate Referrals</CardTitle>
          <CardDescription>Track all referrals across all affiliates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={filterAffiliate} onValueChange={setFilterAffiliate}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filter by affiliate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Affiliates</SelectItem>
                {affiliates.map(affiliate => (
                  <SelectItem key={affiliate} value={affiliate}>
                    {affiliate} ({referrals.filter(r => r.affiliateUsername === affiliate).length})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : filteredReferrals.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No referrals found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Affiliate</th>
                    <th className="text-left py-2 px-2">New User</th>
                    <th className="text-left py-2 px-2">Email</th>
                    <th className="text-left py-2 px-2">Count</th>
                    <th className="text-left py-2 px-2">Joined</th>
                    <th className="text-left py-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReferrals.map((referral) => {
                    const affiliateCount = referrals.filter(r => r.affiliateUsername === referral.affiliateUsername).length;
                    const isAtRisk = affiliateCount === 1;
                    const isProfitable = affiliateCount >= 2;

                    return (
                      <tr
                        key={referral.id}
                        className={`border-b ${isAtRisk ? 'bg-red-50' : isProfitable ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                      >
                        <td className="py-3 px-2 font-medium">{referral.affiliateUsername}</td>
                        <td className="py-3 px-2">{referral.newUserUsername}</td>
                        <td className="py-3 px-2">{referral.newUserEmail}</td>
                        <td className="py-3 px-2">{affiliateCount}</td>
                        <td className="py-3 px-2">
                          {new Date(referral.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`text-xs font-semibold ${
                            isAtRisk ? 'text-red-700 bg-red-100' :
                            isProfitable ? 'text-green-700 bg-green-100' :
                            'text-gray-700 bg-gray-100'
                          } px-2 py-1 rounded`}>
                            {isAtRisk ? '⚠️ At Risk' : isProfitable ? '✅ Profitable' : '⏳ Pending'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats by Affiliate */}
      <Card>
        <CardHeader>
          <CardTitle>Affiliate Summary</CardTitle>
          <CardDescription>Performance metrics per affiliate</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : affiliates.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No affiliates yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Affiliate</th>
                    <th className="text-center py-2 px-2">Referrals</th>
                    <th className="text-center py-2 px-2">Commission</th>
                    <th className="text-left py-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliates.map(affiliate => {
                    const count = referrals.filter(r => r.affiliateUsername === affiliate).length;
                    const commission = count >= 10 ? '75%' : count >= 2 ? '70%' : 'N/A';
                    const status = count >= 2 ? '✅ Profitable' : count === 1 ? '⚠️ At Risk' : '⏳ No Referrals';

                    return (
                      <tr key={affiliate} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2 font-medium">{affiliate}</td>
                        <td className="py-3 px-2 text-center font-bold">{count}</td>
                        <td className="py-3 px-2 text-center">{commission}</td>
                        <td className="py-3 px-2">{status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

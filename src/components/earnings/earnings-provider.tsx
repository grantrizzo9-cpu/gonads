'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { format, startOfWeek, getMonth } from 'date-fns';
import { useAuth } from '@/components/auth/auth-provider';
import { useReferrals } from '@/components/referrals/referral-provider';
import { pricingTiers } from '@/lib/site';

// Data types
export interface Referral {
  id: string;
  email: string;
  plan: string;
  status: 'Active' | 'Trial' | 'Canceled';
  commission: number;
  date: Date;
}

export interface Earning {
    amount: number;
    date: Date;
}

// Chart data types
export interface DailyEarning {
    date: string; // e.g., 'Mon', 'Tue'
    earnings: number;
}

export interface MonthlyReferral {
    month: string; // e.g., 'Jan', 'Feb'
    referrals: number;
}

interface EarningsContextType {
  referrals: Referral[];
  earnings: Earning[];
  addEarning: (tierPrice: number) => void;
  dailyEarnings: DailyEarning[];
  monthlyReferrals: MonthlyReferral[];
  totalEarnings: number;
  activeReferrals: number;
}

const EarningsContext = createContext<EarningsContextType | undefined>(undefined);

export const EarningsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { referrals: platformReferrals } = useReferrals();

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);

  useEffect(() => {
    if (!user?.username || !platformReferrals) {
      setReferrals([]);
      setEarnings([]);
      return;
    };

    // Filter platform referrals to find ones made by the current logged-in user
    const myPlatformReferrals = platformReferrals.filter(
      (r) => r.affiliate === user.username
    );

    // Calculate commission rate based on *activated* referrals
    const activeReferralCount = myPlatformReferrals.filter(r => r.status === 'activated').length;
    const commissionRate = activeReferralCount >= 10 ? 0.75 : 0.70;

    // Process only activated referrals for earnings
    const activatedReferrals = myPlatformReferrals.filter(r => r.status === 'activated');

    const processedReferrals: Referral[] = activatedReferrals.map(pr => {
      const planDetails = pricingTiers.find(p => p.name === pr.plan);
      const dailyCommission = planDetails ? planDetails.price * commissionRate : 0;
      
      return {
        id: pr.email,
        email: pr.email,
        plan: pr.plan,
        // The user dashboard expects 'Active', 'Trial', or 'Canceled'. We only have 'activated'.
        // Mapping 'activated' to 'Active' for display.
        status: 'Active',
        commission: dailyCommission,
        date: new Date(), // Mock date, not available in platform referral data
      };
    });
    
    const processedEarnings: Earning[] = processedReferrals.map(r => ({
      amount: r.commission,
      date: r.date,
    }));
    
    setReferrals(processedReferrals);
    setEarnings(processedEarnings);

  }, [user, platformReferrals]);
  
  // This function is the source of the original bug. 
  // It is no longer needed but kept to prevent breaking the payment button component signature.
  // It correctly does nothing now.
  const addEarning = () => {};

  const processEarningsForChart = (): DailyEarning[] => {
    const dailyTotals: { [key: string]: number } = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    
    earnings.forEach(earning => {
        const dayOfWeek = format(earning.date, 'E'); // Mon, Tue, etc.
        if (dayOfWeek in dailyTotals) {
            dailyTotals[dayOfWeek] += earning.amount;
        }
    });

    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
        date: day,
        earnings: dailyTotals[day] || 0
    }));
  };
  
  const processReferralsForChart = (): MonthlyReferral[] => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyTotals: { [key: string]: number } = {};
      monthNames.forEach(m => monthlyTotals[m] = 0);

      referrals.forEach(ref => {
          const monthIndex = getMonth(ref.date);
          const monthName = monthNames[monthIndex];
          monthlyTotals[monthName]++;
      });

      return monthNames.slice(0, 6).map(month => ({
          month,
          referrals: monthlyTotals[month] || 0
      }));
  };

  const totalEarnings = earnings.reduce((acc, item) => acc + item.amount, 0);
  const activeReferrals = referrals.filter(r => r.status === 'Active').length;
  const dailyEarnings = processEarningsForChart();
  const monthlyReferrals = processReferralsForChart();

  const value = { referrals, earnings, addEarning, dailyEarnings, monthlyReferrals, totalEarnings, activeReferrals };

  return (
    <EarningsContext.Provider value={value}>
      {children}
    </EarningsContext.Provider>
  );
};

export const useEarnings = (): EarningsContextType => {
  const context = useContext(EarningsContext);
  if (context === undefined) {
    throw new Error('useEarnings must be used within an EarningsProvider');
  }
  return context;
};

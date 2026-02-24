'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { format, startOfWeek, addDays, getMonth } from 'date-fns';

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
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);

  const addEarning = useCallback((tierPrice: number) => {
    const commission = tierPrice * 0.70; // 70% commission
    const newReferral: Referral = {
        id: `ref_${Date.now()}`,
        email: `customer${Math.floor(Math.random() * 10000)}@example.com`,
        plan: tierPrice > 50 ? 'Pro' : 'Starter',
        status: 'Active',
        commission,
        date: new Date(),
    };
    const newEarning: Earning = {
        amount: commission,
        date: new Date(),
    };

    setReferrals(prev => [...prev, newReferral]);
    setEarnings(prev => [...prev, newEarning]);
  }, []);

  const processEarningsForChart = (): DailyEarning[] => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
    const dailyTotals: { [key: string]: number } = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    
    earnings.forEach(earning => {
        const dayOfWeek = format(earning.date, 'E'); // Mon, Tue, etc.
        if (dayOfWeek in dailyTotals) {
            dailyTotals[dayOfWeek] += earning.amount;
        }
    });

    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
        date: day,
        earnings: dailyTotals[day]
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

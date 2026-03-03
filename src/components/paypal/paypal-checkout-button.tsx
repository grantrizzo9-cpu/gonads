'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { useReferrals } from '@/components/referrals/referral-provider';
import { type PricingTier } from '@/lib/site';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// PayPal subscription plan IDs from environment variables
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';

export function PayPalCheckoutButton({ tier }: { tier: PricingTier }) {
    const { activateAccount, user } = useAuth();
    const { activateReferral } = useReferrals();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = useCallback(async () => {
        if (!user || !user.email) {
            toast({ 
                title: "You must be logged in", 
                description: "Please log in or sign up to activate a plan.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        try {
            // Redirect to PayPal subscription flow with the plan ID
            const returnUrl = `${window.location.origin}/dashboard/upgrade?payment_success=true&planName=${encodeURIComponent(tier.name)}`;
            const cancelUrl = `${window.location.origin}/dashboard/upgrade`;
            
            // PayPal subscription URL pattern
            const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick-subscriptions&business=${PAYPAL_CLIENT_ID}&item_name=${encodeURIComponent(tier.name + ' Plan')}&item_number=${tier.id}&a3=${tier.price}&p3=1&t3=D&src=1&sra=1&no_note=1&charset=UTF-8&custom=${user.uid}&return=${encodeURIComponent(returnUrl)}&cancel_return=${encodeURIComponent(cancelUrl)}&notify_url=${encodeURIComponent(`${window.location.origin}/api/paypal/webhook`)}`;
            
            window.location.href = paypalUrl;
        } catch (e) {
            console.error("Error initiating PayPal subscription:", e);
            toast({
                title: "Error",
                description: "Failed to initiate payment. Please try again.",
                variant: "destructive"
            });
            setIsLoading(false);
        }
    }, [user, tier, toast, activateAccount]);

    return (
        <div className="w-full">
             <Button className="w-full" onClick={handleSubscribe} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Processing...' : `Activate ${tier.name} Plan`}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
                Secure payments powered by PayPal.
            </p>
        </div>
    );
}

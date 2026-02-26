'use client';

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { type ReactNode } from "react";

// The app will first look for NEXT_PUBLIC_PAYPAL_SANDBOX_CLIENT_ID, and fall back to NEXT_PUBLIC_PAYPAL_CLIENT_ID for production.
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_SANDBOX_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

export function PayPalProvider({ children }: { children: ReactNode }) {
  // A more robust check to ensure the Client ID is not a placeholder.
  // If no ID is provided, or if it contains a placeholder value, use PayPal's 'sb' default for sandbox.
  // This prevents the app from crashing if the .env variable is missing or not configured.
  const isPlaceholder = !PAYPAL_CLIENT_ID || PAYPAL_CLIENT_ID.includes('your_');
  const clientId = isPlaceholder ? 'sb' : PAYPAL_CLIENT_ID;
  
  if (clientId === 'sb' && process.env.NODE_ENV !== 'production') {
      console.warn(`
        *****************************************************************
        * PAYPAL PAYMENTS ARE NOT CONFIGURED.                           *
        *                                                               *
        * To enable real PayPal payments, set NEXT_PUBLIC_PAYPAL_SANDBOX_CLIENT_ID *
        * in your .env file and restart your Next.js development server.                  *
        * Using a fallback 'sb' client ID for now.                      *
        *****************************************************************
      `);
  }

  return (
    <PayPalScriptProvider options={{ clientId: clientId, currency: 'AUD', intent: 'capture' }}>
      {children}
    </PayPalScriptProvider>
  );
}

'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  // In a real app, you'd want to handle this more gracefully,
  // perhaps by disabling payment features and logging a critical error.
  console.error("CRITICAL: STRIPE_SECRET_KEY environment variable is not set. Payment verification will fail.");
}

// Initialize Stripe only if the key exists.
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const VerifyStripeSessionInputSchema = z.object({
  sessionId: z.string().describe('The ID of the Stripe Checkout Session to verify.'),
});
export type VerifyStripeSessionInput = z.infer<typeof VerifyStripeSessionInputSchema>;

const VerifyStripeSessionOutputSchema = z.object({
  status: z.string().describe('The payment status of the session (e.g., "paid", "unpaid").'),
  planName: z.string().nullable().describe('The name of the plan purchased in the session.'),
  userId: z.string().nullable().describe('The user ID passed as the client_reference_id.'),
});
export type VerifyStripeSessionOutput = z.infer<typeof VerifyStripeSessionOutputSchema>;

export async function verifyStripeSession(input: VerifyStripeSessionInput): Promise<VerifyStripeSessionOutput> {
  return verifyStripeSessionFlow(input);
}

const verifyStripeSessionFlow = ai.defineFlow(
  {
    name: 'verifyStripeSessionFlow',
    inputSchema: VerifyStripeSessionInputSchema,
    outputSchema: VerifyStripeSessionOutputSchema,
  },
  async ({ sessionId }) => {
    if (!stripe) {
      throw new Error('Stripe is not configured on the server. The STRIPE_SECRET_KEY environment variable is missing.');
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    let planName: string | null = null;

    // PRIMARY METHOD: Check the session's metadata. 
    // This is the most direct way to get the plan name we passed in the URL.
    if (session.metadata && session.metadata.planName) {
        planName = session.metadata.planName;
    } 
    // FALLBACK METHOD: If metadata is not present for any reason, get it from the line items.
    // This is more robust and serves as a reliable backup.
    else {
        const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
          expand: ['data.price.product'],
        });
        
        if (lineItems.data && lineItems.data.length > 0) {
          const product = lineItems.data[0].price?.product;
          if (product && typeof product === 'object' && 'name' in product) {
            planName = product.name as string;
          }
        }
    }
    
    return {
        status: session.payment_status,
        planName: planName,
        userId: session.client_reference_id,
    };
  }
);

'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable not set.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items.data.price.product'],
    });

    let planName: string | null = null;
    if (session.line_items && session.line_items.data && session.line_items.data.length > 0) {
        const product = session.line_items.data[0].price?.product;
        if (typeof product === 'object' && product !== null && 'name' in product) {
            planName = product.name as string;
        }
    }

    return {
        status: session.payment_status,
        planName: planName,
        userId: session.client_reference_id,
    };
  }
);

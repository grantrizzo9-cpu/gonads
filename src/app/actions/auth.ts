'use server';

import { sendWelcomeEmail } from '@/lib/brevo';

export async function handleUserSignup(
  email: string,
  userName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await sendWelcomeEmail(email, userName);
    return result;
  } catch (error) {
    console.error('Error in handleUserSignup:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

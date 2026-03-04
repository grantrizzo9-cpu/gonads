import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { username, email } = await req.json();

    if (!username || !email) {
      return NextResponse.json(
        { error: 'Username and email are required' },
        { status: 400 }
      );
    }

    const { db } = initializeFirebase();

    // Create or update affiliate record
    const affiliateRef = db.collection('affiliates').doc(username);
    await affiliateRef.set(
      {
        username,
        email,
        registeredAt: new Date(),
      },
      { merge: true }
    );

    return NextResponse.json(
      { success: true, message: 'Affiliate registered' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error registering affiliate:', error);
    return NextResponse.json(
      { error: 'Failed to register affiliate' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const { db } = initializeFirebase();

    // Fetch all referrals from admin collection
    const referralsSnapshot = await db
      .collection('admin-referrals')
      .orderBy('createdAt', 'desc')
      .get();

    const referrals = referralsSnapshot.docs.map(doc => ({
      id: doc.id,
      affiliateUsername: doc.data().affiliateUsername,
      newUserUsername: doc.data().newUserUsername,
      newUserEmail: doc.data().newUserEmail,
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
      referralCountForAffiliate: doc.data().referralCountForAffiliate,
    }));

    return NextResponse.json(
      {
        success: true,
        referrals,
        totalReferrals: referrals.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching all referrals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referrals' },
      { status: 500 }
    );
  }
}

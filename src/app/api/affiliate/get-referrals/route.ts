import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const { db } = initializeFirebase();

    // Fetch referrals for the given affiliate username
    const referralsSnapshot = await db
      .collection('affiliates')
      .doc(username)
      .collection('referrals')
      .orderBy('createdAt', 'desc')
      .get();

    const referrals = referralsSnapshot.docs.map(doc => ({
      id: doc.id,
      newUserUsername: doc.data().newUserUsername,
      newUserEmail: doc.data().newUserEmail,
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
    }));

    // Get affiliate stats
    const affiliateDocSnapshot = await db.collection('affiliates').doc(username).get();
    const affiliateData = affiliateDocSnapshot.data();

    return NextResponse.json(
      {
        success: true,
        referrals,
        referralCount: referrals.length,
        commissionTier: referrals.length >= 10 ? '75%' : '70%',
        affiliateEmail: affiliateData?.email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referrals' },
      { status: 500 }
    );
  }
}

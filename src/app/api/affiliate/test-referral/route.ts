import { db } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  // Example payload: { affiliateUsername: 'testaffiliate', newUserEmail: 'testuser@example.com', newUserUsername: 'testuser' }
  const { affiliateUsername, newUserEmail, newUserUsername } = await req.json();

  if (!affiliateUsername || !newUserEmail || !newUserUsername) {
    return Response.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  // Get or create affiliate document
  const affiliateRef = db.collection('affiliates').doc(affiliateUsername);
  const affiliateDoc = await affiliateRef.get();

  let affiliateData: any = {
    username: affiliateUsername,
    referralCount: 1,
    lastReferralAt: new Date(),
  };

  if (affiliateDoc.exists) {
    const current = affiliateDoc.data() || {};
    affiliateData = {
      ...current,
      referralCount: (current.referralCount || 0) + 1,
      lastReferralAt: new Date(),
    };
  }

  // Add referral to subcollection
  const referralRef = affiliateRef.collection('referrals').doc();
  await referralRef.set({
    email: newUserEmail,
    username: newUserUsername,
    createdAt: new Date(),
  });

  // Update affiliate count
  await affiliateRef.set(affiliateData, { merge: true });

  return Response.json({
    success: true,
    message: `Test referral added for ${affiliateUsername}`,
    referralCount: affiliateData.referralCount,
  });
}

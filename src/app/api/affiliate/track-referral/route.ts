import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { affiliateUsername, newUserUsername, newUserEmail } = await req.json();

    if (!affiliateUsername || !newUserUsername || !newUserEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize Firebase
    const { db } = initializeFirebase();

    // Log referral to Firestore under affiliate's referrals
    const referralRef = db.collection('affiliates').doc(affiliateUsername).collection('referrals').doc();
    await referralRef.set({
      newUserUsername,
      newUserEmail,
      createdAt: new Date(),
      status: 'active',
    });

    // Get the affiliate's total referral count
    const affiliateRef = db.collection('affiliates').doc(affiliateUsername);
    const referralsSnapshot = await db
      .collection('affiliates')
      .doc(affiliateUsername)
      .collection('referrals')
      .get();

    const referralCount = referralsSnapshot.size;

    // Update affiliate document with count
    await affiliateRef.set(
      {
        username: affiliateUsername,
        referralCount,
        lastReferralDate: new Date(),
      },
      { merge: true }
    );

    // Log to global admin collection for admin dashboard
    const adminReferralRef = db.collection('admin-referrals').doc();
    await adminReferralRef.set({
      affiliateUsername,
      newUserUsername,
      newUserEmail,
      createdAt: new Date(),
      referralCountForAffiliate: referralCount,
    });

    // If count = 2, send email alerts to both affiliate and admin
    if (referralCount === 2) {
      // Get affiliate's email from affiliates collection
      const affiliateDocSnapshot = await affiliateRef.get();
      const affiliateEmail = affiliateDocSnapshot.data()?.email;

      if (affiliateEmail) {
        // Send email to affiliate
        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': process.env.BREVO_API_KEY || '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: [{ email: affiliateEmail, name: affiliateUsername }],
            from: {
              email: process.env.BREVO_SENDER_EMAIL || 'admin@rizzosai.com',
              name: 'RizzoSAI',
            },
            subject: '🎉 Congratulations! You reached 2 referrals - You\'re now profitable!',
            htmlContent: `
              <h2>Congratulations, ${affiliateUsername}!</h2>
              <p>You've successfully referred <strong>2 users</strong> to RizzoSAI. You're now in profit mode! 💰</p>
              <p><strong>Your Commission Rate:</strong> 70% per sale (or 75% at 10+ referrals)</p>
              <p><strong>Referral Details:</strong></p>
              <ul>
                <li>New User: ${newUserUsername}</li>
                <li>Email: ${newUserEmail}</li>
              </ul>
              <p>Keep sharing your affiliate link to earn more! Every referral counts towards your commissions.</p>
              <p><a href="https://rizzosai.com/dashboard/referrals">View Your Referrals</a></p>
            `,
          }),
        });
      }

      // Send email to admin
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_API_KEY || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: [{ email: process.env.BREVO_SENDER_EMAIL || 'admin@rizzosai.com' }],
          from: {
            email: process.env.BREVO_SENDER_EMAIL || 'admin@rizzosai.com',
            name: 'RizzoSAI System',
          },
          subject: `⚠️ Affiliate Alert: ${affiliateUsername} reached 2 referrals - Now Profitable`,
          htmlContent: `
            <h2>Affiliate Profitability Alert</h2>
            <p><strong>Affiliate:</strong> ${affiliateUsername}</p>
            <p><strong>Referral Count:</strong> 2</p>
            <p><strong>Status:</strong> Now in profit mode - chargeback risk reduced ✅</p>
            <p><strong>Latest Referral:</strong></p>
            <ul>
              <li>Username: ${newUserUsername}</li>
              <li>Email: ${newUserEmail}</li>
              <li>Time: ${new Date().toLocaleString()}</li>
            </ul>
            <p><a href="https://rizzosai.com/dashboard/admin/referrals">View All Referrals</a></p>
          `,
        }),
      });
    }

    return NextResponse.json(
      {
        success: true,
        referralCount,
        message: referralCount === 2 ? 'Referral logged and alerts sent!' : 'Referral logged successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error tracking referral:', error);
    return NextResponse.json(
      { error: 'Failed to track referral' },
      { status: 500 }
    );
  }
}

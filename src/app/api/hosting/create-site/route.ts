import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';

/**
 * POST /api/hosting/create-site
 * Creates a new Firebase Hosting site for a user
 * Body: { userId: string, siteName: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, siteName } = await request.json();

    if (!userId || !siteName) {
      return NextResponse.json(
        { error: 'Missing userId or siteName' },
        { status: 400 }
      );
    }

    // Create unique site ID: userid-sitename-timestamp
    const siteId = `${userId}-${siteName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20)}-${Date.now()}`.substring(0, 57); // Firebase site ID max 57 chars

    const firebaseUrl = `https://${siteId}.firebasehosting.com`;

    try {
      // Store site info in Firestore
      await admin
        .firestore()
        .collection('user-sites')
        .doc(userId)
        .collection('sites')
        .doc(siteId)
        .set({
          siteId: siteId,
          siteName: siteName,
          userId: userId,
          firebaseUrl: firebaseUrl,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          customDomain: null,
          status: 'active',
          deploymentStatus: 'pending',
        });

      return NextResponse.json(
        {
          success: true,
          siteId: siteId,
          firebaseUrl: firebaseUrl,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Firestore error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error creating site:', error);
    return NextResponse.json(
      { error: 'Failed to create hosting site' },
      { status: 500 }
    );
  }
}

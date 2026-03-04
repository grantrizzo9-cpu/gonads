import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';

/**
 * POST /api/hosting/add-custom-domain
 * Adds a custom domain to a Firebase Hosting site
 * Body: { userId: string, siteId: string, customDomain: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, siteId, customDomain } = await request.json();

    if (!userId || !siteId || !customDomain) {
      return NextResponse.json(
        { error: 'Missing userId, siteId, or customDomain' },
        { status: 400 }
      );
    }

    // Validate domain format
    if (!isValidDomain(customDomain)) {
      return NextResponse.json(
        { error: 'Invalid domain format' },
        { status: 400 }
      );
    }

    try {
      // Check if domain already exists in Firestore
      const domainsSnapshot = await admin
        .firestore()
        .collectionGroup('sites')
        .where('customDomain', '==', customDomain)
        .get();

      if (!domainsSnapshot.empty) {
        return NextResponse.json(
          { error: 'Domain is already in use' },
          { status: 409 }
        );
      }

      // Update Firestore with custom domain info
      await admin
        .firestore()
        .collection('user-sites')
        .doc(userId)
        .collection('sites')
        .doc(siteId)
        .update({
          customDomain: customDomain,
          domainStatus: 'pending_dns_verification',
          dnsRecords: generateDNSRecords(customDomain, siteId),
          domainAddedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      return NextResponse.json(
        {
          success: true,
          customDomain,
          dnsRecords: generateDNSRecords(customDomain, siteId),
          message:
            'Custom domain added. Please update your DNS records at your domain registrar.',
        },
        { status: 201 }
      );
    } catch (error: any) {
      console.error('Firestore error:', error);
      if (error.message.includes('ALREADY_EXISTS')) {
        return NextResponse.json(
          { error: 'Domain is already in use' },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Error adding custom domain:', error);
    return NextResponse.json(
      { error: 'Failed to add custom domain' },
      { status: 500 }
    );
  }
}

function isValidDomain(domain: string): boolean {
  const domainRegex =
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
  return domainRegex.test(domain);
}

function generateDNSRecords(
  domain: string,
  siteId: string
): { type: string; name: string; value: string }[] {
  return [
    {
      type: 'A',
      name: domain,
      value: '199.36.239.21', // Firebase Hosting IPv4
    },
    {
      type: 'AAAA',
      name: domain,
      value: '2001:4860:4864:20::3521', // Firebase Hosting IPv6
    },
    {
      type: 'CNAME',
      name: `www.${domain}`,
      value: `${siteId}.firebasehosting.com`,
    },
  ];
}

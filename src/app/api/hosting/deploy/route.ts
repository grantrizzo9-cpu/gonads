import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';

/**
 * POST /api/hosting/deploy
 * Deploys generated HTML to a Firebase Hosting site
 * Body: { userId: string, siteId: string, htmlContent: string, assets: { [key: string]: string } }
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, siteId, htmlContent, assets } = await request.json();

    if (!userId || !siteId || !htmlContent) {
      return NextResponse.json(
        { error: 'Missing userId, siteId, or htmlContent' },
        { status: 400 }
      );
    }

    const bucket = admin.storage().bucket();
    const sitePath = `user-sites/${userId}/${siteId}`;

    // Upload main HTML file
    const htmlFile = bucket.file(`${sitePath}/index.html`);
    await htmlFile.save(htmlContent, {
      metadata: {
        contentType: 'text/html; charset=utf-8',
        cacheControl: 'no-cache',
      },
    });

    // Upload additional assets if provided
    if (assets) {
      for (const [filename, content] of Object.entries(assets)) {
        const assetFile = bucket.file(`${sitePath}/${filename}`);
        const contentType = getContentType(filename);
        await assetFile.save(content as string, {
          metadata: {
            contentType,
            cacheControl:
              filename.includes('.') && !filename.endsWith('.html')
                ? 'public, max-age=31536000'
                : 'no-cache',
          },
        });
      }
    }

    // Update site deployment info in Firestore
    await admin
      .firestore()
      .collection('user-sites')
      .doc(userId)
      .collection('sites')
      .doc(siteId)
      .update({
        lastDeployed: admin.firestore.FieldValue.serverTimestamp(),
        deploymentStatus: 'deployed',
        storagePath: sitePath,
      });

    return NextResponse.json(
      {
        success: true,
        message: 'Site deployed successfully',
        siteId,
        storagePath: sitePath,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deploying site:', error);
    return NextResponse.json(
      { error: 'Failed to deploy site' },
      { status: 500 }
    );
  }
}

function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const types: { [key: string]: string } = {
    html: 'text/html; charset=utf-8',
    css: 'text/css; charset=utf-8',
    js: 'application/javascript; charset=utf-8',
    json: 'application/json; charset=utf-8',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    webp: 'image/webp',
    woff: 'font/woff',
    woff2: 'font/woff2',
    ttf: 'font/ttf',
  };
  return types[ext || ''] || 'application/octet-stream';
}

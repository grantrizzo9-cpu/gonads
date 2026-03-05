import { db } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  const { userId, domain, registrationInfo } = await req.json();
  if (!userId || !domain) {
    return Response.json({ error: 'Missing userId or domain.' }, { status: 400 });
  }
  await db.collection('users').doc(userId).collection('domains').doc(domain).set({
    ...registrationInfo,
    purchasedAt: new Date(),
  });
  return Response.json({ success: true });
}

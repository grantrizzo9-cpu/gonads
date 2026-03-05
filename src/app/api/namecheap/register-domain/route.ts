import { registerDomain } from '@/lib/namecheap';

export async function POST(req: Request) {
  const { domain, years, contact } = await req.json();
  if (!domain || !contact) {
    return Response.json({ error: 'Domain and contact info required.' }, { status: 400 });
  }
  try {
    const result = await registerDomain(domain, years || 1, contact);
    return Response.json({ success: true, result });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Domain registration failed.' }, { status: 500 });
  }
}

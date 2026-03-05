import { searchDomain } from '@/lib/namecheap';

export async function POST(req: Request) {
  const { domain } = await req.json();
  if (!domain) {
    return Response.json({ error: 'Domain is required.' }, { status: 400 });
  }
  try {
    const result = await searchDomain(domain);
    return Response.json({ success: true, result });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Domain search failed.' }, { status: 500 });
  }
}

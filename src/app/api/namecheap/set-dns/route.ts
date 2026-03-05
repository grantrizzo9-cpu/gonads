import { setDNS } from '@/lib/namecheap';

export async function POST(req: Request) {
  const { domain, hostRecords } = await req.json();
  if (!domain || !hostRecords) {
    return Response.json({ error: 'Domain and host records required.' }, { status: 400 });
  }
  try {
    const result = await setDNS(domain, hostRecords);
    return Response.json({ success: true, result });
  } catch (error: any) {
    return Response.json({ error: error.message || 'DNS setup failed.' }, { status: 500 });
  }
}

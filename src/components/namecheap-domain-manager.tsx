import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export function NamecheapDomainManager() {
  const [domain, setDomain] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [registering, setRegistering] = useState(false);
  const [dnsRecords, setDnsRecords] = useState<any>(null);
  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: '',
  });

  const handleSearch = async () => {
    setSearchResult(null);
    const res = await fetch('/api/namecheap/search-domain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain }),
    });
    const data = await res.json();
    setSearchResult(data.result);
  };

  const handleRegister = async () => {
    setRegistering(true);
    const res = await fetch('/api/namecheap/register-domain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain, contact }),
    });
    const data = await res.json();
    setRegistering(false);
    alert(data.success ? 'Domain registered!' : data.error);
  };

  const handleSetDNS = async () => {
    // Example DNS records for Firebase Hosting
    const hostRecords = [
      { Type: 'A', Name: '@', Address: '1.2.3.4' },
      { Type: 'A', Name: 'www', Address: '1.2.3.4' },
    ];
    const res = await fetch('/api/namecheap/set-dns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain, hostRecords }),
    });
    const data = await res.json();
    setDnsRecords(data.result);
    alert(data.success ? 'DNS records set!' : data.error);
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Domain Manager</h2>
      <div className="space-y-4">
        <Input
          placeholder="Enter domain (e.g. mysite.com)"
          value={domain}
          onChange={e => setDomain(e.target.value)}
        />
        <Button onClick={handleSearch}>Search Domain</Button>
        {searchResult && (
          <div>
            <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(searchResult, null, 2)}</pre>
            <h3 className="mt-4 font-semibold">Contact Info for Registration</h3>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="First Name" value={contact.firstName} onChange={e => setContact({ ...contact, firstName: e.target.value })} />
              <Input placeholder="Last Name" value={contact.lastName} onChange={e => setContact({ ...contact, lastName: e.target.value })} />
              <Input placeholder="Email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} />
              <Input placeholder="Address" value={contact.address} onChange={e => setContact({ ...contact, address: e.target.value })} />
              <Input placeholder="City" value={contact.city} onChange={e => setContact({ ...contact, city: e.target.value })} />
              <Input placeholder="State" value={contact.state} onChange={e => setContact({ ...contact, state: e.target.value })} />
              <Input placeholder="Zip" value={contact.zip} onChange={e => setContact({ ...contact, zip: e.target.value })} />
              <Input placeholder="Country" value={contact.country} onChange={e => setContact({ ...contact, country: e.target.value })} />
              <Input placeholder="Phone" value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} />
            </div>
            <Button className="mt-4" onClick={handleRegister} disabled={registering}>Register Domain</Button>
          </div>
        )}
        <Button className="mt-4" onClick={handleSetDNS}>Set DNS for Firebase Hosting</Button>
        {dnsRecords && (
          <div>
            <h3 className="mt-4 font-semibold">DNS Result</h3>
            <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(dnsRecords, null, 2)}</pre>
          </div>
        )}
      </div>
    </Card>
  );
}

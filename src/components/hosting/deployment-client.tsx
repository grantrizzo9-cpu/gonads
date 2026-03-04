'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Check, AlertCircle } from 'lucide-react';

interface DeploymentProps {
  userId: string;
  htmlContent: string;
  assets?: { [key: string]: string };
}

export function DeploymentClient({
  userId,
  htmlContent,
  assets,
}: DeploymentProps) {
  const [siteName, setSiteName] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [siteId, setSiteId] = useState('');
  const [firebaseUrl, setFirebaseUrl] = useState('');
  const [dnsRecords, setDnsRecords] = useState<
    { type: string; name: string; value: string }[]
  >([]);
  const [error, setError] = useState('');
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);

  const handleDeploy = async () => {
    if (!siteName.trim()) {
      setError('Please enter a site name');
      return;
    }

    if (!customDomain.trim()) {
      setError('Please enter a custom domain');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step 1: Create Firebase Hosting site
      const createResponse = await fetch('/api/hosting/create-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          siteName: siteName.trim(),
        }),
      });

      if (!createResponse.ok) {
        const err = await createResponse.json();
        throw new Error(err.error || 'Failed to create hosting site');
      }

      const { siteId: newSiteId, firebaseUrl: fbUrl } =
        await createResponse.json();
      setSiteId(newSiteId);
      setFirebaseUrl(fbUrl);

      // Step 2: Deploy HTML content
      const deployResponse = await fetch('/api/hosting/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          siteId: newSiteId,
          htmlContent,
          assets: assets || {},
        }),
      });

      if (!deployResponse.ok) {
        const err = await deployResponse.json();
        throw new Error(err.error || 'Failed to deploy site');
      }

      // Step 3: Add custom domain
      const domainResponse = await fetch('/api/hosting/add-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          siteId: newSiteId,
          customDomain: customDomain.trim(),
        }),
      });

      if (!domainResponse.ok) {
        const err = await domainResponse.json();
        throw new Error(err.error || 'Failed to add custom domain');
      }

      const { dnsRecords: records } = await domainResponse.json();
      setDnsRecords(records);
      setDeployed(true);
    } catch (err: any) {
      setError(err.message || 'Deployment failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, recordType: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(recordType);
    setTimeout(() => setCopiedRecord(null), 2000);
  };

  if (deployed) {
    return (
      <div className="space-y-6">
        <Alert className="border-green-200 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Site deployed successfully! Now add these DNS records to your domain
            registrar.
          </AlertDescription>
        </Alert>

        <Card className="p-6">
          <h3 className="mb-4 font-semibold">Your Site URLs</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-600">Firebase Hosting URL:</p>
              <p className="font-mono text-blue-600">{firebaseUrl}</p>
            </div>
            <div>
              <p className="text-gray-600">Custom Domain:</p>
              <p className="font-mono text-blue-600">{customDomain}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 font-semibold">DNS Records to Add</h3>
          <p className="mb-4 text-sm text-gray-600">
            Update these records at your domain registrar (Namecheap):
          </p>
          <div className="space-y-4">
            {dnsRecords.map((record) => (
              <div
                key={`${record.type}-${record.name}`}
                className="rounded border p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">Type</p>
                      <p className="font-mono font-semibold">{record.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Name/Host</p>
                      <p className="font-mono">{record.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Value/Data</p>
                      <p className="break-all font-mono">{record.value}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      copyToClipboard(record.value, record.type)
                    }
                  >
                    {copiedRecord === record.type ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Alert>
          <AlertDescription>
            <p className="mb-2 font-semibold">Next Steps:</p>
            <ol className="space-y-1 text-sm">
              <li>1. Log into Namecheap</li>
              <li>2. Go to Advanced DNS for {customDomain}</li>
              <li>3. Add/update the records above</li>
              <li>4. Wait 24-48 hours for DNS propagation</li>
              <li>5. Your domain will auto-convert to HTTPS</li>
            </ol>
          </AlertDescription>
        </Alert>

        <Button
          onClick={() => {
            setDeployed(false);
            setSiteName('');
            setCustomDomain('');
            setDnsRecords([]);
          }}
          variant="outline"
        >
          Deploy Another Site
        </Button>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="mb-6 text-xl font-semibold">Deploy to Custom Domain</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Site Name (e.g., "My Portfolio")
          </label>
          <Input
            placeholder="Enter a name for your site"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Custom Domain (e.g., "myclient.com")
          </label>
          <Input
            placeholder="your-domain.com"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">
            Must own or have control of this domain
          </p>
        </div>

        <Button
          onClick={handleDeploy}
          disabled={loading || !siteName.trim() || !customDomain.trim()}
          className="w-full"
        >
          {loading ? 'Deploying...' : 'Deploy Site'}
        </Button>
      </div>
    </Card>
  );
}

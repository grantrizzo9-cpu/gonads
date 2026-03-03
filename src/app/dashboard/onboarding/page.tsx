'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Globe, BookOpen, Users, Video, Zap } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 py-12">
      <div className="container max-w-4xl px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-accent">
            Welcome to RizzoSAI
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Everything you need to build, launch, and monetize your online empire
          </p>
          <p className="text-lg font-semibold text-primary animate-pulse">
            ✓ Payment Confirmed! Let's get started.
          </p>
        </div>

        {/* Quick Start Guide */}
        <div className="grid gap-6 mb-12">
          {/* Feature Overview */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Your AI-Powered Arsenal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Website Generator */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Globe className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg">Website Generator</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Create stunning, fully-functional websites in minutes with AI-powered design and optimization. Choose from niche markets, and we'll generate:
                      </p>
                      <ul className="text-sm space-y-1 mt-2 ml-3">
                        <li>✓ Professional landing pages</li>
                        <li>✓ Mobile-responsive design</li>
                        <li>✓ SEO-optimized structure</li>
                        <li>✓ Integrated affiliate links</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Blog Creator */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg">Blog Creator</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Generate high-quality blog posts and articles automatically:
                      </p>
                      <ul className="text-sm space-y-1 mt-2 ml-3">
                        <li>✓ 600+ word articles in seconds</li>
                        <li>✓ Keyword-optimized for SEO</li>
                        <li>✓ Engaging headlines & structure</li>
                        <li>✓ Ready-to-publish quality</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Social Platform Generator */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Users className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg">Social Platform Generator</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Build engaged communities and grow your reach:
                      </p>
                      <ul className="text-sm space-y-1 mt-2 ml-3">
                        <li>✓ Community setup guides</li>
                        <li>✓ Engagement strategies</li>
                        <li>✓ Cross-platform posting</li>
                        <li>✓ Growth hacking templates</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Video Creator */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Video className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg">Video Creator</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Turn your content into engaging videos:
                      </p>
                      <ul className="text-sm space-y-1 mt-2 ml-3">
                        <li>✓ Script generation</li>
                        <li>✓ Platform-specific formats</li>
                        <li>✓ Short-form video optimization</li>
                        <li>✓ Call-to-action templates</li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Domain & Hosting Setup */}
          <Card className="border-2 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-accent" />
                Getting Your Domain Online
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div>
                <h3 className="font-bold text-lg mb-4">Step 1: Purchase Your Domain</h3>
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <p className="text-sm mb-3">
                    RizzoSAI uses our integrated domain marketplace to make purchasing simple and seamless.
                  </p>
                  <Button asChild className="w-full sm:w-auto">
                    <a 
                      href="https://rizzosai.shopco.com/site/home" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center"
                    >
                      Browse Domains
                    </a>
                  </Button>
                </div>
                <div className="text-sm space-y-2 text-muted-foreground">
                  <p>✓ Choose from thousands of available domains</p>
                  <p>✓ Competitive pricing with instant activation</p>
                  <p>✓ Full WHOIS privacy available</p>
                  <p>✓ Automatic renewal options</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-4">Step 2: Connect Your Domain to Your Website</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  After purchasing your domain, follow these steps to connect it to your newly created website:
                </p>

                <div className="space-y-4">
                  
                  <div className="bg-background border border-border rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                      Log into Your Domain Registrar
                    </h4>
                    <p className="text-sm text-muted-foreground ml-8">
                      Access your domain registrar account at <span className="font-mono bg-muted px-2 py-1 rounded">shopco.com</span> and navigate to the DNS management section for your domain.
                    </p>
                  </div>

                  <div className="bg-background border border-border rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                      Copy DNS Records from RizzoSAI Dashboard
                    </h4>
                    <p className="text-sm text-muted-foreground ml-8 mb-3">
                      Go to your RizzoSAI dashboard under <span className="font-semibold">Dashboard → Domains</span>, add your domain, and copy the DNS records we provide.
                    </p>
                    <div className="bg-muted p-3 rounded text-xs font-mono space-y-2 ml-8 mb-3">
                      <p>📋 You'll receive records like:</p>
                      <p>Type: A | Host: @ | Value: 35.219.200.7</p>
                      <p>Type: CNAME | Host: www | Value: yourdomain.com</p>
                      <p>Type: CNAME | Host: _acme-challenge.* | Value: [verification-code]</p>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8 italic">
                      (Note: Your actual values will differ - always use the records from your RizzoSAI dashboard)
                    </p>
                  </div>

                  <div className="bg-background border border-border rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
                      Add the DNS Records to Your Registrar
                    </h4>
                    <p className="text-sm text-muted-foreground ml-8 mb-3">
                      In your domain registrar's DNS management section, add all the records from your RizzoSAI dashboard. This typically involves:
                    </p>
                    <ul className="text-sm space-y-2 ml-8 text-muted-foreground">
                      <li>• Clicking "Add Record" or "Add DNS Record"</li>
                      <li>• Selecting the record type (A, CNAME, TXT, etc.)</li>
                      <li>• Entering the Host/Name and Value fields</li>
                      <li>• Saving each record</li>
                    </ul>
                  </div>

                  <div className="bg-background border border-border rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">4</span>
                      Wait for DNS Propagation & Verify
                    </h4>
                    <p className="text-sm text-muted-foreground ml-8 mb-3">
                      DNS changes can take anywhere from a few minutes to 48 hours to propagate globally. Here's what to do:
                    </p>
                    <ul className="text-sm space-y-2 ml-8 text-muted-foreground">
                      <li>• Use the "Live DNS Check" links in your RizzoSAI dashboard to monitor propagation</li>
                      <li>• Check each record individually to see when it becomes active</li>
                      <li>• Once all records are verified, click the "Refresh Status" button</li>
                      <li>• Your domain will be fully activated and ready to serve your website</li>
                    </ul>
                  </div>

                  <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                      Your Website is Now Live!
                    </h4>
                    <p className="text-sm text-muted-foreground ml-8">
                      Once DNS propagates and is verified, your website will be accessible at your custom domain (e.g., yourdomain.com). Your visitors will see your fully optimized, AI-powered website!
                    </p>
                  </div>

                </div>
              </div>

            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-primary/5 border-2 border-primary">
            <CardHeader>
              <CardTitle>Ready to Launch?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                You're all set to start building your online empire. Here's what to do next:
              </p>
              <ol className="space-y-3 list-decimal list-inside text-sm">
                <li>Head to your dashboard and create your first website</li>
                <li>Add blog posts using the Blog Creator</li>
                <li>Purchase a domain from our domain marketplace</li>
                <li>Connect your domain using the DNS setup guide above</li>
                <li>Share your site on social media and start earning!</li>
              </ol>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button asChild className="flex-1">
                  <Link href="/dashboard">
                    Go to Dashboard
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <a href="https://rizzosai.shopco.com/site/home" target="_blank" rel="noopener noreferrer">
                    Browse Domains
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* FAQ */}
        <div className="bg-muted/50 rounded-lg p-6 border border-border">
          <h2 className="font-headline text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">How long does DNS propagation take?</h3>
              <p className="text-sm text-muted-foreground">
                DNS changes typically propagate within 24 hours, though it can happen much faster (sometimes within minutes). You can check the status in real-time using the DNS check tools in your RizzoSAI dashboard.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do I need technical knowledge to set up my domain?</h3>
              <p className="text-sm text-muted-foreground">
                No! We've made it as simple as possible. Just copy-paste the DNS records from your RizzoSAI dashboard into your domain registrar. Our support team is also available 24/7 if you need help.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I use my existing domain?</h3>
              <p className="text-sm text-muted-foreground">
                Absolutely! Whether you purchase a new domain through us or use an existing one you already own, we support both. Just point the DNS records to RizzoSAI, and you're good to go.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What if my website isn't showing up after DNS changes?</h3>
              <p className="text-sm text-muted-foreground">
                Give it time to propagate (up to 48 hours), clear your browser cache, and try again. If issues persist, use the Live DNS Check tools in your dashboard or contact support.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

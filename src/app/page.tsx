import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Zap, Cpu, DollarSign } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const features = [
  {
    icon: Zap,
    title: "NVMe Edge Hosting",
    description: "Enterprise-grade infrastructure that delivers sub-second load times, giving your sites a critical SEO and user experience advantage.",
    image: PlaceHolderImages.find(img => img.id === 'nvme-speed'),
  },
  {
    icon: Cpu,
    title: "Integrated GenAI Studio",
    description: "Go from idea to deployment in minutes. Generate SEO-optimized articles, ad copy, and even entire niche sites with our Gemini-powered tools.",
    image: PlaceHolderImages.find(img => img.id === 'ai-studio'),
  },
  {
    icon: DollarSign,
    title: "75% Daily Payouts",
    description: "Turn essential infrastructure into a high-velocity income stream. We pay out a market-leading 70-75% recurring commission every 24 hours.",
    image: PlaceHolderImages.find(img => img.id === 'daily-payouts'),
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-background');

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40">
           {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover z-0"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
          <div className="container px-4 sm:px-6 relative z-10 mx-auto text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Infrastructure as Income
            </h1>
            <p className="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl">
              A specialized SaaS platform for high-income affiliate marketers.
              We fused enterprise-grade hosting with AI creation tools and a 75% daily payout program.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">Start Your 3-Day Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full bg-card py-12 md:py-24">
          <div className="container px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">The High-Income Affiliate Stack</h2>
              <p className="mt-4 text-muted-foreground">Everything you need to build, scale, and monetize.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="flex flex-col">
                   {feature.image && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={feature.image.imageUrl}
                        alt={feature.image.description}
                        fill
                        className="object-cover rounded-t-lg"
                        data-ai-hint={feature.image.imageHint}
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                      <feature.icon className="h-6 w-6 text-primary" />
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section id="why-us" className="w-full bg-background py-12 md:py-24">
            <div className="container max-w-4xl px-4 sm:px-6 mx-auto">
                <div className="prose prose-lg max-w-none prose-h2:font-headline prose-h2:text-accent prose-h3:font-headline prose-h3:text-accent">
                    <h2>Why Affiliate AI Host Is The Ultimate Platform for Ambitious Marketers</h2>
                    <p>In the fast-paced world of affiliate marketing, the rules have changed. Success is no longer about just promoting a single product; it’s about building a sustainable, scalable digital business that generates predictable, daily income. The most successful affiliates have evolved; they think and act like portfolio managers, building and nurturing a collection of income-generating assets, not just chasing one-off commissions. Affiliate AI Host was born from this powerful observation. We have built an entire ecosystem from the ground up designed to empower this modern, entrepreneurial approach. Our platform is founded on three core pillars of success: revolutionary daily cashflow, an unparalleled technological advantage, and a force-multiplying AI content engine.</p>
                    <p>We've meticulously engineered every facet of our platform to remove friction, obliterate bottlenecks, and put your growth into hyperdrive. The old rules of waiting months for payouts, spending agonizing weeks on content creation, and wrestling with slow, unreliable hosting are over. We are here to provide you with the enterprise-grade infrastructure, the intelligent tools, and the financial velocity required to not just compete, but to dominate your niches and build a true digital empire. This isn't just another hosting platform; it's a fundamental paradigm shift in how affiliate marketing is done. This is your unfair advantage.</p>
                    
                    <h3>The Daily Payout Revolution: Your Growth, Unchained</h3>
                    <p>Cashflow is the lifeblood of any business. In traditional affiliate marketing, this lifeblood is slowed to a trickle, trapped in a convoluted system of net-30, net-60, or even net-90 payment terms. You make a sale today, you do the work today, but your earnings are held in "capital jail" for months. This is a massive, suffocating drag on your ability to scale. It’s like trying to win a Formula 1 race with the parking brake permanently engaged. You can’t reinvest your earnings into new ad campaigns when they’re hot. You can’t quickly double down on a winning strategy that’s gaining traction. You can’t scale your operations with confidence because your own success is held hostage by archaic payment schedules designed to benefit the network, not you.</p>
                    <p>Affiliate AI Host demolishes this barrier with our revolutionary daily payout system. When you generate a commission, you don't wait. We pay you your industry-leading 70-75% cut every single day, directly to your PayPal account. This isn't just a feature; it's a fundamental rewiring of your business's financial DNA. It transforms your earnings from a static, future promise into a dynamic, daily-compounding growth engine. We call this <strong>cashflow velocity</strong>, and we provide you with the highest velocity in the industry. Every single day, your previous day's success directly funds the next. Your ad campaigns become self-sustaining and can be scaled in real-time. You can test new niches, keywords, and traffic sources with unprecedented speed, using the house's money. While your competitors are waiting for their monthly check to clear, you’ve already reinvested your capital 30 times over, creating an ever-widening performance gap they simply cannot bridge.</p>

                    <h3>Your 3-Day Trial: A Risk-Free Gateway to Daily Income</h3>
                    <p>We understand that talk is cheap. That's why we invite you to experience the power of our platform firsthand with virtually no risk. We’ve designed a unique trial that gives you full, unrestricted access to the power of Affiliate AI Host. To secure your dedicated, high-performance NVMe server slot and prevent abuse from draining resources, we simply ask for a one-time activation fee equivalent to a single day's pricing for your chosen plan. That’s it. It’s a small commitment that unlocks a massive opportunity. Once activated, your next three days are completely on us.</p>
                    <p>This isn't a watered-down, feature-limited trial. You get the full, unadulterated experience. Deploy a real website and test its sub-second load times on GTMetrix. Put our AI Content Studio through its paces; generate a full-length, SEO-optimized article, create a week's worth of social media ad copy, and outline a video script. See for yourself the sheer velocity you can achieve. And here's the most powerful part: <strong>your affiliate link is active from the very first moment</strong>. If you refer someone during your 3-day trial, you start earning your 70% daily commission immediately. It's entirely possible to have your initial activation fee paid back and be in profit before your first official billing day even arrives. This is your opportunity to validate the platform, understand its immense power, and start building your income stream from day one.</p>

                    <h3>The Ultimate AI Co-Pilot for Niche Dominance</h3>
                    <p>Content is the engine of affiliate marketing, but for most, it's also the biggest bottleneck. Quality content takes time, deep research, and significant expertise. Or, at least, it used to. Our integrated AI Studio, powered by Google's state-of-the-art Gemini models, is your personal on-demand marketing agency, ready 24/7 to turn your ideas into high-performance content across multiple formats.</p>
                    <p>Our AI features are tiered to grow with you, providing the right tools at the right stage of your business journey.</p>
                    <p>Starting with the <strong>Starter Plan</strong>, you unlock our <strong>Basic AI Tools</strong>, including the powerful AI Ad Copy generator. This is your key to crafting high-converting ad copy that grabs attention and drives clicks across any platform. Stop guessing and start generating platform-optimized copy for Facebook, Google Ads, and more in seconds.</p>
                    <p>As you move to the <strong>Bronze Plan</strong>, you gain access to a formidable suite of <strong>Article, Blog, and Website Creation tools</strong>. This is your content scaling engine. You can build entire niche authority sites from the ground up in record time. Use our tools to generate long-form, SEO-optimized articles that build trust, and pillar pages that establish your authority in a new niche, driving organic traffic for years to come.</p>
                    <p>Our higher-tier plans like <strong>Silver, Gold, and Platinum</strong> give you the full, unrestricted power of this content suite, with higher limits and priority access, allowing you to manage a whole portfolio of content-rich websites effortlessly.</p>
                    <p>But the true game-changer, the ultimate weapon in your affiliate arsenal, awaits on our <strong>Diamond Plan: AI Video Generation</strong>. Video is the most engaging, highest-converting medium online, but it's also the most resource-intensive to create. Our tool completely solves this problem. It can transform a blog post into a structured, engaging video script or generate entirely new video concepts from a simple prompt. This gives you the unprecedented ability to dominate high-engagement platforms like YouTube and TikTok without ever needing to hire a video editor or scriptwriter. This is how you achieve true content velocity—being everywhere your audience is, with quality, platform-native content, produced at a scale your competitors can only dream of.</p>
                </div>
            </div>
        </section>

        {/* OpenSRS & Transparency Section */}
        <section className="w-full bg-card py-12 md:py-24">
          <div className="container px-4 sm:px-6 grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Transparent & Reliable Foundation</h2>
              <p className="mt-4 text-muted-foreground">
                We're built on industry-leading technology. Our domain fulfillment is powered by the OpenSRS registrar pipeline, one of the world's largest and most trusted domain providers. This ensures seamless, reliable domain management for you and your referrals.
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Rock-Solid DNS</h3>
                    <p className="text-muted-foreground">Fast, secure, and reliable domain routing for maximum uptime.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Automated Provisioning</h3>
                    <p className="text-muted-foreground">Firebase Hosting integration means your sites are provisioned instantly and securely.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative h-80 rounded-lg bg-muted p-6">
              <div className="flex flex-col items-center justify-center h-full">
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

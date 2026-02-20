
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, WalletCards, Users, Wand2, BookText, Server } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const whyPartnerFeatures = [
  {
    icon: DollarSign,
    title: "Generous 75% Commissions",
    description: "Earn substantial recurring commissions on every sale. Super affiliates who refer over 10 customers unlock our top-tier 75% rate.",
  },
  {
    icon: WalletCards,
    title: "Daily PayPal Payouts",
    description: "No more waiting for your money. We pay out your commissions every single day directly to your PayPal account. No minimums.",
  },
  {
    icon: Users,
    title: "Permanent Referrals",
    description: "When you refer a user, they are yours for life. You earn commission on their recurring subscription payments, year after year.",
  },
  {
    icon: Wand2,
    title: "Integrated AI Tools",
    description: "Our subscriptions include access to powerful AI tools designed to help you and your referrals build and grow businesses faster.",
  },
  {
    icon: BookText,
    title: "Exclusive Marketing Guides",
    description: "Access a library of expert, written guides. The more you upgrade, the more advanced strategies you unlock to boost your sales.",
  },
  {
    icon: Server,
    title: "Reliable Web Hosting",
    description: "Offer your referrals fast, secure, and high-performance web hosting that they can depend on, increasing your conversion rates.",
  },
];

const incomePathSteps = [
    {
        title: "Create Your Account & Choose a Plan",
        description: "Sign up to get your unique referral link. Your referred users will immediately appear on your dashboard.",
    },
    {
        title: "Activate Your 3-Day Trial",
        description: "A one-time activation fee is all it takes to get instant access to your dashboard and tools. The first three days of the platform are free.",
    },
    {
        title: "Promote, Refer & Get Paid Daily",
        description: "Earn 70-75% daily commission on recurring daily sales from your referrals after their trial ends. Payouts are sent automatically to your PayPal every day.",
    },
]

export default function Home() {
  const incomePathImage = PlaceHolderImages.find(img => img.id === 'income-path');

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-background">
          <div className="container px-4 sm:px-6 mx-auto text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
              Earn 70%-75% Daily Commissions with<br/> <span className="text-primary">AI-Powered Hosting</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl">
              Get started today and get paid daily for every referral you make. Our automated system handles everything.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Partner Section */}
        <section id="features" className="w-full bg-secondary py-12 md:py-24">
          <div className="container px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Why Partner with Host Pro Ai?</h2>
              <p className="mt-4 text-muted-foreground">We've built the ultimate platform for affiliates to thrive.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {whyPartnerFeatures.map((feature) => (
                <Card key={feature.title} className="flex flex-col text-center items-center bg-card shadow-sm border border-transparent transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                     <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="h-6 w-6" />
                     </div>
                    <CardTitle className="font-headline text-xl">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Your Simple Path to Daily Income Section */}
        <section id="income-path" className="w-full bg-background py-12 md:py-24">
            <div className="container grid items-center gap-12 px-4 md:px-6 lg:grid-cols-2 lg:gap-24">
                <div className="space-y-8">
                    <div className="space-y-3">
                        <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Your Simple Path to Daily Income</h2>
                        <p className="text-muted-foreground">In just three easy steps, you can be on your way to earning reliable, daily income.</p>
                    </div>
                    <ul className="space-y-6">
                        {incomePathSteps.map((step, index) => (
                             <li key={index} className="flex gap-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">{index + 1}</div>
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-lg">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                 {incomePathImage && (
                    <div className="relative flex h-full min-h-[400px] items-center justify-center">
                         <Image
                            src={incomePathImage.imageUrl}
                            alt={incomePathImage.description}
                            width={600}
                            height={600}
                            className="object-cover rounded-lg"
                            data-ai-hint={incomePathImage.imageHint}
                        />
                    </div>
                 )}
            </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

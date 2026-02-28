
'use client';

import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main className="flex-1">
        <div className="container max-w-4xl px-4 sm:px-6 py-12 md:py-24">
          <p className="text-sm text-muted-foreground mb-8">Last Updated: March 2026</p>
          <h1 className="font-headline text-4xl font-bold mb-8 text-accent">Privacy Policy</h1>
          <div className="prose prose-h2:text-accent space-y-4">
            <p>This Privacy Policy describes how your personal information is collected, used, and shared when you visit, create an account, or make a purchase from Rizzos Ai (the "Site").</p>
            
            <h2 className="font-headline">Personal Information We Collect</h2>
            <p>When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site. We refer to this automatically-collected information as “Device Information.”</p>
            <p>When you create an account or make a purchase, we collect certain information from you, including your name, email address, and payment information. We refer to this information as “Order Information.” When we talk about “Personal Information” in this Privacy Policy, we are talking both about Device Information and Order Information.</p>

            <h2 className="font-headline">How Do We Use Your Personal Information?</h2>
            <p>We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information and providing you with an account). Additionally, we use this Order Information to:</p>
            <ul className="list-disc list-inside">
                <li>Communicate with you;</li>
                <li>Screen our orders for potential risk or fraud; and</li>
                <li>When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.</li>
            </ul>
            <p>We use the Device Information that we collect to help us screen for potential risk and fraud (in particular, your IP address), and more generally to improve and optimize our Site (for example, by generating analytics about how our customers browse and interact with the Site, and to assess the success of our marketing and advertising campaigns).</p>

            <h2 className="font-headline">Affiliate Program Data</h2>
            <p>If you join our affiliate program, we collect information necessary to manage your affiliate account. This includes your username, payout information (e.g., email address for your payment provider), and performance data such as clicks, referrals, and commissions earned. We use this data to accurately track your performance, calculate and process your daily payouts, and communicate with you about the affiliate program.</p>

            <h2 className="font-headline">Payment Processing</h2>
            <p>We use third-party payment processors (such as Stripe) to handle all payment transactions. We do not collect or store your full payment card details on our servers. When you make a payment, your payment information is provided directly to our third-party payment processors whose use of your personal information is governed by their own Privacy Policy. These payment processors adhere to the standards set by PCI-DSS as managed by the PCI Security Standards Council, which is a joint effort of brands like Visa, Mastercard, American Express and Discover.</p>
            
            <h2 className="font-headline">Sharing Your Personal Information</h2>
            <p>We share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use Google Cloud and Firebase for authentication, database services, and hosting. We also use Stripe to process payments—you can read more about how Stripe uses your Personal Information here: https://stripe.com/privacy.</p>
            <p>Finally, we may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.</p>
            
            <h2 className="font-headline">Data Retention</h2>
            <p>When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information. You can request deletion of your account and associated data by contacting us.</p>

            <h2 className="font-headline">Your Rights and Compliance</h2>
            <p>We are committed to complying with applicable privacy laws. If you are a European resident, you have the right under the General Data Protection Regulation (GDPR) to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you are an Australian resident, you have similar rights under the Australian Privacy Principles (APPs) contained within the Privacy Act 1988. If you would like to exercise any of these rights, please contact us through the contact information below.</p>
            <p>Our practices are designed to comply with the Australian Privacy Act 1988 and its Australian Privacy Principles (APPs), ensuring your data is handled with care and transparency.</p>

            <h2 className="font-headline">Changes</h2>
            <p>We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

            <h2 className="font-headline">Contact Us</h2>
            <p>For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at admin@rizzosai.com.</p>
          </div>
        </div>
      </main>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}

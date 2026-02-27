
'use client';

import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function DisclaimerPage() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main className="flex-1">
        <div className="container max-w-4xl px-4 sm:px-6 py-12 md:py-24">
          <h1 className="font-headline text-4xl font-bold mb-8 text-accent">Earnings Disclaimer</h1>
          <div className="prose prose-h2:text-accent space-y-4">
            <p>The following disclaimer outlines the terms regarding earnings and income potential associated with the Rizzos Ai platform. By using our service, you acknowledge and agree to the terms described below.</p>

            <h2 className="font-headline">No Guarantees of Income</h2>
            <p>Any earnings, revenue, or income statements, including any examples shared on this website, are provided for illustrative purposes only. They represent estimates of potential earnings and should not be interpreted as a promise or guarantee of any specific level of income. There is no assurance that you will achieve similar results.</p>
            <p>Your individual success will depend on numerous factors, including your personal background, dedication, business experience, work ethic, and the market conditions in which you operate. We do not have control over these factors and therefore cannot and do not guarantee your success or income level.</p>

            <h2 className="font-headline">Testimonials and Examples</h2>
            <p>Testimonials and examples of exceptional results are not intended to represent or guarantee that anyone will achieve the same or similar results. Where specific income figures are used and attributed to an individual or business, those persons or businesses have earned that amount. There is no assurance you will do as well. Any and all claims or representations as to income earnings on this website are not to be considered as average earnings.</p>

            <h2 className="font-headline">Forward-Looking Statements</h2>
            <p>Materials contained on this website or in materials purchased and/or downloaded from this website may contain information that includes or is based upon forward-looking statements within the meaning of the securities litigation reform act of 1995. Forward-looking statements give our expectations or forecasts of future events. You can identify these statements by the fact that they do not relate strictly to historical or current facts.</p>
            <p>They use words such as "anticipate," "estimate," "expect," "project," "intend," "plan," "believe," and other words and terms of similar meaning in connection with a description of potential earnings or financial performance.</p>

            <h2 className="font-headline">Due Diligence</h2>
            <p>You are advised to do your own due diligence when it comes to making business decisions and should use caution and seek the advice of qualified professionals. You should check with your accountant, lawyer, or professional advisor, before acting on this or any information. You may not consider any examples, documents, or other content on the website or otherwise provided by us to be the equivalent of legal advice.</p>

            <h2 className="font-headline">Assumption of Risk</h2>
            <p>By participating in this affiliate program, you understand that there are inherent risks in any business venture and you assume all risks related to the use of our platform and the marketing of our services. Rizzos Ai is not responsible for any of your actions, and you agree not to hold the company or its owners liable for any of your decisions, actions or results, at any time, under any circumstance.</p>
          </div>
        </div>
      </main>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}

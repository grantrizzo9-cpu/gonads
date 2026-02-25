'use server';
/**
 * @fileOverview A Genkit flow for generating the complete JSON content for a themed, single-page affiliate website.
 *
 * - generateWebsiteJson - A function that generates the JSON content structure for a landing page.
 * - GenerateWebsiteJsonInput - The input type for the generateWebsiteJson function.
 * - GenerateWebsiteJsonOutput - The return type for the generateWebsiteJson function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateWebsiteJsonInputSchema = z.object({
  username: z.string().describe("The affiliate's username."),
  niche: z.string().describe('The niche topic for the affiliate website.'),
});
export type GenerateWebsiteJsonInput = z.infer<
  typeof GenerateWebsiteJsonInputSchema
>;

const GenerateWebsiteJsonOutputSchema = z.object({
  homepage: z.object({
    title: z.string().describe('SEO-friendly site title for the niche.'),
    navLinks: z
      .array(z.object({ text: z.string(), href: z.string() }))
      .length(3)
      .describe('An array of 3 navigation links.'),
    headline: z.string().describe('A high-conversion, catchy headline.'),
    subheadline: z
      .string()
      .describe('A persuasive subheadline expanding on the main message, at least 40 words long.'),
    ctaButtonText: z.string().describe('A strong call-to-action text for the main button.'),
    features: z
      .array(
        z.object({
          title: z.string(),
          description: z.string().describe('A detailed description of the feature, at least 30 words long.'),
          iconEmoji: z.string().describe('A single emoji representing the feature.'),
        })
      )
      .length(3)
      .describe('An array of 3 key features with detailed descriptions.'),
    testimonials: z
      .array(
        z.object({
          text: z.string().describe('A realistic, fictional testimonial of at least 2-3 sentences.'),
          name: z.string(),
          role: z.string(),
        })
      )
      .length(3)
      .describe('An array of 3 realistic, fictional testimonials.'),
    faqs: z
      .array(z.object({ 
          question: z.string(), 
          answer: z.string().describe('A comprehensive answer to the question, at least 50 words long.') 
        }))
      .min(4)
      .max(6)
      .describe('An array of 4 to 6 frequently asked questions with comprehensive answers, including one about the refund policy.'),
    finalCta: z.object({
      headline: z.string(),
      subheadline: z.string(),
      buttonText: z.string(),
    }),
  }),
  legal: z.object({
    terms: z.string().describe('Full boilerplate text for Terms & Conditions, at least 400 words long.'),
    privacy: z.string().describe('Full boilerplate text for a Privacy Policy, at least 400 words long.'),
    disclaimer: z.string().describe('Full boilerplate text for an Earnings Disclaimer, at least 200 words long.'),
  }),
});

export type GenerateWebsiteJsonOutput = z.infer<
  typeof GenerateWebsiteJsonOutputSchema
>;

export async function generateWebsiteJson(
  input: GenerateWebsiteJsonInput
): Promise<GenerateWebsiteJsonOutput> {
  return websiteGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'websiteGeneratorPrompt',
  input: { schema: GenerateWebsiteJsonInputSchema },
  output: { schema: GenerateWebsiteJsonOutputSchema },
  prompt: `You are an expert copywriter and marketing strategist. Your task is to generate all the content for a high-converting affiliate marketing landing page.

The goal of this landing page is to promote an AI-powered website hosting platform and get visitors to sign up using the affiliate's link.

However, to make each website unique, you will create a *fictional brand identity* for the platform that is tailored to the affiliate's specified niche.

The affiliate's niche is: {{{niche}}}.
The affiliate's username is: {{{username}}}.

Based on the niche, invent a creative and compelling brand name for the platform. This brand name should be reflected in the 'title' field of the output. All subsequent content (headlines, features, testimonials, etc.) should be written as if it's for this new, unique brand, and should be tailored to appeal to someone interested in that niche.

- The 'title' should be the SEO-friendly site title, incorporating your new fictional brand name.
- For the features, describe the benefits of an AI-powered hosting platform for someone in that niche, using your fictional brand name.
- For testimonials, invent names and roles that fit the niche and have them praise your fictional brand.
- For FAQs, anticipate questions someone from that niche might have about your fictional platform. You MUST include one FAQ that asks "What is your refund policy?" and the answer must clearly state: A refund on the one-time activation fee is available if requested within 24 hours of joining, but only if you have not received any commission payouts. If payouts have been sent, a refund is not possible.
- For legal text, generate standard, comprehensive boilerplate content of a suitable length for real websites.
- CRITICAL: Although the website has a fictional brand, all CTA buttons will eventually link to the real platform at "https://hostproai.com/?ref={{{username}}}". The button text should be action-oriented and fit the fictional brand.
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
});

const websiteGeneratorFlow = ai.defineFlow(
  {
    name: 'websiteGeneratorFlow',
    inputSchema: GenerateWebsiteJsonInputSchema,
    outputSchema: GenerateWebsiteJsonOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate website content.');
    }
    return output;
  }
);

'use server';
/**
 * @fileOverview A Genkit flow for describing the content of a video.
 *
 * - describeVideo - A function that generates a description for a video.
 * - DescribeVideoInput - The input type for the describeVideo function.
 * - DescribeVideoOutput - The return type for the describeVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DescribeVideoInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DescribeVideoInput = z.infer<typeof DescribeVideoInputSchema>;

const DescribeVideoOutputSchema = z.object({
  description: z.string().describe('A detailed description of the video content, including objects, people, and actions.'),
  tags: z.array(z.string()).describe('A list of relevant tags or keywords for the video.'),
});
export type DescribeVideoOutput = z.infer<typeof DescribeVideoOutputSchema>;

export async function describeVideo(input: DescribeVideoInput): Promise<DescribeVideoOutput> {
  return describeVideoFlow(input);
}

const describeVideoFlow = ai.defineFlow(
  {
    name: 'describeVideoFlow',
    inputSchema: DescribeVideoInputSchema,
    outputSchema: DescribeVideoOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-1.5-pro-latest',
      prompt: [
        { text: `You are a video analysis expert. Watch the following video carefully and provide a detailed description of its content. Identify the key objects, people, setting, and any actions taking place. Also, generate a list of relevant tags or keywords that summarize the video's themes.` },
        { media: { url: input.videoDataUri } },
      ],
      output: {
          schema: DescribeVideoOutputSchema,
      }
    });

    const output = llmResponse.output;

    if (!output) {
      throw new Error('Failed to describe video content.');
    }
    return output;
  }
);

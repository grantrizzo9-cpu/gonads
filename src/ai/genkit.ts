
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {config} from 'dotenv';

// Explicitly load environment variables from .env file
config();

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
    console.warn("GEMINI_API_KEY is not set in .env file. AI features may not function correctly if the key is not set in the hosting environment.");
}

// The googleAI() plugin will find the key from the environment if the apiKey property is omitted.
// This change prevents passing `apiKey: undefined`, which was causing a startup crash.
const googleAiPlugin = googleAI(geminiApiKey ? { apiKey: geminiApiKey } : {});

export const ai = genkit({
  plugins: [googleAiPlugin],
  model: 'googleai/gemini-2.5-flash',
});

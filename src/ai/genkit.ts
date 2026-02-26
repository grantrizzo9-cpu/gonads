import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {config} from 'dotenv';

// Explicitly load environment variables from .env file
config();

// Explicitly pass the API key to the plugin to ensure it's loaded correctly.
// This prevents a server crash if the key isn't found automatically in the environment.
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
    console.warn("GEMINI_API_KEY is not set. Some AI features may not work.");
}

export const ai = genkit({
  plugins: [googleAI({apiKey: geminiApiKey})],
  model: 'googleai/gemini-2.5-flash',
});

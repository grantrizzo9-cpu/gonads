
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
    console.warn("GEMINI_API_KEY is not set in the environment. AI features will be disabled, but the site will continue to run.");
}

// The googleAI() plugin will find the key from the environment if the apiKey property is omitted.
// Passing 'undefined' instead of '{}' allows the plugin to use its default key-finding behavior.
const googleAiPlugin = googleAI(geminiApiKey ? { apiKey: geminiApiKey } : undefined);

export const ai = genkit({
  plugins: [googleAiPlugin],
  model: 'googleai/gemini-2.5-flash',
});

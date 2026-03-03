import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate that all required config values are present
const missingConfigs = Object.entries(firebaseConfig)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingConfigs.length > 0) {
  console.warn(
    `Missing Firebase configuration: ${missingConfigs.join(', ')}. ` +
    `Please add the following to your .env.local file:\n` +
    `NEXT_PUBLIC_FIREBASE_API_KEY\n` +
    `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN\n` +
    `NEXT_PUBLIC_FIREBASE_PROJECT_ID\n` +
    `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET\n` +
    `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID\n` +
    `NEXT_PUBLIC_FIREBASE_APP_ID`
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;

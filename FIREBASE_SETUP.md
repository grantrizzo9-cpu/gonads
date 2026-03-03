# Firebase & Custom Domains Setup Guide

## What's Been Configured

I've set up your app with:

1. **Real Firebase Firestore Integration** - Replaced mock localStorage with live Firebase database
2. **Domain Management Functions** - Ready to map domains to websites
3. **Domain Management UI Component** - A comprehensive panel for users to manage their custom domains

---

## Step 1: Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (appears to be `studio-9195964548-d846f` based on your `apphosting.yaml`)
3. Click **Project Settings** (gear icon)
4. Go to **General** tab
5. Scroll down and look for **Web APIs** section - you should see your config
6. Copy these values:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

## Step 2: Set Up Environment Variables

1. Create a `.env.local` file in your project root (it should NOT be committed to git)
2. Add your Firebase credentials:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

STRIPE_SECRET_KEY=your_stripe_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

An example file (``.env.local.example`) has been created in your project root showing the format.

## Step 3: Set Up Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create Database**
3. Choose **Start in production mode** (you'll add security rules next)
4. Select your preferred region
5. Create the database

## Step 4: Configure Firestore Security Rules

In your Firestore Console, go to **Rules** tab and replace with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId}/websites/{document=**} {
      allow read, write: if request.auth.uid == userId;
    }

    // Domain mappings - public read, user write
    match /domains/{domain=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Step 5: Integrate Domain Management into Your Dashboard

### Option A: Use the New DomainManagementPanel Component

Add this to a new route or existing dashboard page:

```tsx
'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { DomainManagementPanel } from '@/components/domains/domain-management-panel';

export default function DomainsPage() {
    const { user } = useAuth();

    if (!user) {
        return <div>Please log in</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Custom Domains</h1>
            <DomainManagementPanel userId={user.uid} />
        </div>
    );
}
```

The component handles:
- ✅ Listing user's generated websites
- ✅ Creating domain-to-website mappings
- ✅ Displaying connected domains
- ✅ DNS record instructions for users
- ✅ Removing domain mappings

### Option B: Integrate with Existing Domains Page

Update your existing `/dashboard/domains/page.tsx` to use the new Firestore functions and display domain mappings.

## Step 6: Deploy to Vercel

1. Push your code to GitHub (if not already)
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - etc. (all the NEXT_PUBLIC_* variables)
5. Deploy!

## Step 7: Configure Custom Domains on Vercel

For users' domains to work properly:

1. Your app URL will be something like: `your-app.vercel.app`
2. When users connect a domain (e.g., `user-site.com`):
   - They need to add a CNAME record in their registrar:
     ```
     Host: user-site.com
     Type: CNAME
     Value: your-app.vercel.app
     ```
3. Your app detects the incoming domain via `window.location.hostname` and serves their website via the `DomainRouter` component

## How It Works End-to-End

```
User: "I want user-site.com to use my generated website"
              ↓
User connects domain via DomainManagementPanel
              ↓
Firestore stores: domains/user-site.com -> {userId, websiteId}
              ↓
User adds CNAME in their registrar pointing to your-app.vercel.app
              ↓
Visitor goes to user-site.com
              ↓
Your Vercel app receives the request (DomainRouter component)
              ↓
Detects hostname is "user-site.com"
              ↓
Queries Firestore for domain mapping
              ↓
Loads and serves the user's generated website via iframe
```

## Key Files Modified

- **`src/lib/firebase.ts`** (NEW) - Firebase initialization with environment variables
- **`src/lib/firestore.ts`** (UPDATED) - Real Firebase Firestore operations
- **`src/components/domains/domain-management-panel.tsx`** (NEW) - UI for domain management
- **`.env.local.example`** (NEW) - Environment variable template

## Testing Locally

```bash
# 1. Install dependencies (if needed)
npm install

# 2. Start dev server
npm run dev

# 3. Test at http://localhost:3000
```

The DomainRouter component will skip domain checking on localhost and show your homepage.

## Troubleshooting

**Firebase config not found:**
- ✅ Check that `.env.local` is in your project root
- ✅ All variables start with `NEXT_PUBLIC_`
- ✅ Restart your dev server after adding env vars

**Domains not showing up:**
- ✅ Check Firestore has data in `/domains` collection
- ✅ Check browser console for errors
- ✅ Verify Firebase rules allow read access

**Website not loading on custom domain:**
- ✅ Verify CNAME record is propagated (can take 24-48 hours)
- ✅ Check that website was saved with `saveWebsite()`
- ✅ Check domain mapping exists in Firestore

---

## Next Steps

1. Get Firebase credentials and add to `.env.local`
2. Create Firestore database and set security rules
3. Deploy to Vercel
4. Test domain connection with a test domain
5. Update your website generator flow to call `saveWebsite()` to store generated HTML
6. Users can now use DomainManagementPanel to connect their domains!

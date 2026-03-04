import { AuthForm } from '@/components/auth/auth-form';

export default function SignupPage({ searchParams }: { searchParams: { username?: string, ref?: string, theme?: string } }) {
  // Use ?username= for affiliate links, fall back to ?ref= for backward compatibility
  const affiliateUsername = searchParams?.username || searchParams?.ref;
  return <AuthForm mode="signup" affiliateUsername={affiliateUsername} themeName={searchParams?.theme} />;
}

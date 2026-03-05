
import { useEffect, useState } from 'react';
import { AuthForm } from '@/components/auth/auth-form';

export default function SignupPage() {
  const [referrer, setReferrer] = useState<string | undefined>(undefined);
  const [themeName, setThemeName] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      const username = params.get('username');
      const theme = params.get('theme');
      setReferrer(ref || username || undefined);
      setThemeName(theme || undefined);
    }
  }, []);

  return <AuthForm mode="signup" referrer={referrer} themeName={themeName} />;
}

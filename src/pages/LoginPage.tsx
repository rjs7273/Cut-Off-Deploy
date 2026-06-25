import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SocialLoginButtonGroup from '@/components/auth/SocialLoginButtonGroup';
import TermsConsentModal from '@/components/auth/TermsConsentModal';
import LoginLoadingOverlay from '@/components/auth/LoginLoadingOverlay';
import { useAuthStore } from '@/store/authStore';
import { useUserPrefsStore } from '@/store/userPrefsStore';

type Provider = 'google' | 'apple';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const selectedCategories = useUserPrefsStore((s) => s.selectedCategories);
  const notificationEnabled = useUserPrefsStore((s) => s.notificationEnabled);
  const [loginProvider, setLoginProvider] = useState<Provider | null>(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleSelectProvider(provider: Provider) {
    setLoginProvider(provider);
    setIsTermsOpen(true);
  }

  async function handleAgreeContinue() {
    if (!loginProvider) return;
    setIsTermsOpen(false);
    setIsLoading(true);

    try {
      await login(loginProvider, { selectedCategories, notificationEnabled });
      navigate('/onboard', { replace: true });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col bg-surface overflow-hidden" style={{ height: '100dvh' }}>
      <header className="h-[56px] flex items-center justify-between px-5 bg-surface border-b border-line flex-shrink-0 pt-safe">
        <div className="w-9" />
        <span className="text-[18px] font-bold text-fg tracking-[-0.5px] select-none">
          Cut<span className="text-navy">-off</span>
        </span>
        <div className="w-9" />
      </header>

      <main className="flex-1 flex flex-col justify-center px-[30px] pb-[30px] pt-2">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-[32px] font-bold text-fg tracking-[-1px] select-none">
            Cut<span className="text-navy">-off</span>
          </h1>
          <p className="text-[15px] text-fg-muted text-center leading-[1.35] mt-3 select-none">
            오늘 볼 만한 영상 하나.
          </p>
        </div>

        <SocialLoginButtonGroup
          onSelectGoogle={() => handleSelectProvider('google')}
          onSelectApple={() => handleSelectProvider('apple')}
          disabled={isLoading}
        />
      </main>

      <TermsConsentModal
        isOpen={isTermsOpen}
        provider={loginProvider}
        onClose={() => setIsTermsOpen(false)}
        onAgreeContinue={handleAgreeContinue}
      />

      <LoginLoadingOverlay isOpen={isLoading} provider={loginProvider} />
    </div>
  );
}

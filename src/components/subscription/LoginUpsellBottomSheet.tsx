/* ─────────────────────────────────────────────────────────────────
   LoginUpsellBottomSheet  (CMP-SUB-002)
   ─────────────────────────────────────────────────────────────────
   비회원에게 로그인 + 구독 유도. Google/Apple 로그인 버튼 포함.
   AppLayout 전역 슬롯. overlayStore.loginUpsellSheetSource 로 개폐.

   초안 HTML 참조: #login-upsell-sheet
   ───────────────────────────────────────────────────────────────── */
import { useState } from 'react';
import BottomSheet from '@/components/ui/BottomSheet';
import SocialLoginButtonGroup from '@/components/auth/SocialLoginButtonGroup';
import TermsConsentModal from '@/components/auth/TermsConsentModal';
import LoginLoadingOverlay from '@/components/auth/LoginLoadingOverlay';
import { useOverlayStore } from '@/store/overlayStore';
import { useAuthStore } from '@/store/authStore';
import { useUserPrefsStore } from '@/store/userPrefsStore';
import {
  LOGIN_UPSELL_BENEFITS,
  SubUpsellIcon,
  SubscriptionBenefitList,
} from './_shared';

type Provider = 'google' | 'apple';

export default function LoginUpsellBottomSheet() {
  const loginUpsellSheetSource = useOverlayStore((s) => s.loginUpsellSheetSource);
  const closeLoginUpsellSheet  = useOverlayStore((s) => s.closeLoginUpsellSheet);
  const showToast              = useOverlayStore((s) => s.showToast);
  const login = useAuthStore((s) => s.login);
  const selectedCategories     = useUserPrefsStore((s) => s.selectedCategories);
  const notificationEnabled    = useUserPrefsStore((s) => s.notificationEnabled);

  const [loginProvider, setLoginProvider] = useState<Provider | null>(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isOpen = loginUpsellSheetSource !== null;

  function handleSelectProvider(provider: Provider) {
    setLoginProvider(provider);
    setIsTermsOpen(true);
  }

  async function handleAgreeContinue() {
    if (!loginProvider) return;
    setIsTermsOpen(false);
    setIsLoading(true);

    try {
      await login(loginProvider, {
        selectedCategories,
        notificationEnabled,
      });
      closeLoginUpsellSheet();
      showToast('로그인됐습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleClose() {
    if (isLoading) return;
    closeLoginUpsellSheet();
  }

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={handleClose} showClose dismissible={!isLoading}>
        <div className="px-5 pt-2 pb-6">
          <SubUpsellIcon variant="login" />

          <h2 className="text-[20px] font-bold text-fg text-center tracking-[-0.5px] mb-[6px]">
            구독이 필요해요
          </h2>
          <p className="text-[14px] text-fg-muted text-center leading-[1.6] mb-5">
            Cut off를 구독하고
            <br />
            아래의 기능을 온전히 이용하세요.
          </p>

          <SubscriptionBenefitList items={LOGIN_UPSELL_BENEFITS} />

          <SocialLoginButtonGroup
            onSelectGoogle={() => handleSelectProvider('google')}
            onSelectApple={() => handleSelectProvider('apple')}
            disabled={isLoading}
          />
        </div>
      </BottomSheet>

      <TermsConsentModal
        isOpen={isTermsOpen}
        provider={loginProvider}
        onClose={() => setIsTermsOpen(false)}
        onAgreeContinue={handleAgreeContinue}
      />

      <LoginLoadingOverlay isOpen={isLoading} provider={loginProvider} />
    </>
  );
}

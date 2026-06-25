type Provider = 'google' | 'apple';

interface LoginLoadingOverlayProps {
  isOpen: boolean;
  provider: Provider | null;
}

export default function LoginLoadingOverlay({ isOpen, provider }: LoginLoadingOverlayProps) {
  const label = provider === 'google' ? 'Google' : provider === 'apple' ? 'Apple' : '';

  return (
    <div
      aria-hidden={!isOpen}
      aria-label="로그인 처리 중"
      role="status"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-white/85 backdrop-blur-[3px] transition-opacity duration-150"
      style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
    >
      {/* 스피너 */}
      <div
        className="w-9 h-9 rounded-full border-[3px] border-black/8 border-t-navy"
        style={{ animation: 'login-spin 0.7s linear infinite' }}
      />
      {/* 텍스트 */}
      {label && (
        <p className="text-[14px] font-semibold text-navy tracking-[-0.2px]">
          {label}로 로그인 중...
        </p>
      )}
    </div>
  );
}

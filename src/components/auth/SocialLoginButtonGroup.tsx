interface SocialLoginButtonGroupProps {
  onSelectGoogle: () => void;
  onSelectApple: () => void;
  disabled?: boolean;
}

export default function SocialLoginButtonGroup({
  onSelectGoogle,
  onSelectApple,
  disabled = false,
}: SocialLoginButtonGroupProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Google */}
      <button
        type="button"
        onClick={onSelectGoogle}
        disabled={disabled}
        className="w-full h-12 flex items-center justify-center gap-[10px] bg-white border border-line rounded-xl text-[15px] font-semibold text-[#111] transition-opacity active:opacity-70 disabled:opacity-50"
      >
        {/* Google 공식 컬러 로고 */}
        <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true" className="flex-shrink-0">
          <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.659 32.657 29.252 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.955 3.045l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
          <path fill="#FF3D00" d="M6.306 14.691 12.88 19.51C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.955 3.045l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.347 4.337-17.694 10.691z"/>
          <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.164 35.091 26.715 36 24 36c-5.231 0-9.63-3.327-11.295-7.946l-6.523 5.025C9.5 39.556 16.227 44 24 44z"/>
          <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.044 2.912-3.126 5.168-6.084 6.571l.003-.002 6.19 5.238C34.973 40.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
        </svg>
        <span>Google로 계속하기</span>
      </button>

      {/* Apple */}
      <button
        type="button"
        onClick={onSelectApple}
        disabled={disabled}
        className="w-full h-12 flex items-center justify-center gap-[10px] bg-[#000] border-none rounded-xl text-[15px] font-semibold text-white transition-opacity active:opacity-70 disabled:opacity-50"
      >
        {/* Apple 로고 */}
        <svg width="18" height="22" viewBox="0 0 24 24" aria-hidden="true" className="flex-shrink-0">
          <path fill="#fff" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
        <span>Apple로 계속하기</span>
      </button>
    </div>
  );
}

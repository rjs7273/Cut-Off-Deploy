/* ─────────────────────────────────────────────────────────────────
   CMP-MY-002 · GuestProfileSection
   비회원 상태의 프로필 + 로그인 버튼 영역.

   초안 HTML 참조:
     .mypage-profile (border-bottom:none)
     .profile-avatar (52px, circle, surface-sub, border)
     .pname / .psince
     btn-google + btn-apple (height:48px)
   ───────────────────────────────────────────────────────────────── */
import SocialLoginButtonGroup from '@/components/auth/SocialLoginButtonGroup';

interface Props {
  onClickLogin: () => void;
}

export default function GuestProfileSection({ onClickLogin }: Props) {
  return (
    <>
      {/* 프로필 행 */}
      <div className="flex items-center gap-[14px] px-[20px] py-[20px]">
        {/* 아바타 */}
        <div className="w-[52px] h-[52px] rounded-full bg-surface-sub border border-line flex items-center justify-center text-fg-muted flex-shrink-0">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8.2" r="3.4" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M5.5 18.5c.8-2.8 3.4-4.5 6.5-4.5s5.7 1.7 6.5 4.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* 이름 + 설명 */}
        <div>
          <p className="text-[17px] font-bold text-fg">비회원</p>
          <p className="text-[12px] text-fg-muted mt-[2px]">
            로그인하면 기기 간 동기화가 가능합니다.
          </p>
        </div>
      </div>

      {/* 로그인 버튼 */}
      <div className="px-[20px] pb-[4px] border-b border-line">
        <SocialLoginButtonGroup
          onSelectGoogle={onClickLogin}
          onSelectApple={onClickLogin}
        />
      </div>
    </>
  );
}

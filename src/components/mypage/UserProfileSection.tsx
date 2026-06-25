/* ─────────────────────────────────────────────────────────────────
   CMP-MY-003 · UserProfileSection
   로그인 사용자 프로필 행.

   초안 HTML 참조:
     .mypage-profile (border-bottom:none)
     .profile-avatar (52px, gradient, white text — 이름 첫 글자)
     .pname (17px/700) / .psince (12px/text-2/mt-2px)
   ───────────────────────────────────────────────────────────────── */

export interface UserProfile {
  /** 표시 이름 */
  name: string;
  email: string;
  /** "YYYY년 M월부터" 형식 */
  since: string;
  /** 아바타에 표시할 이니셜 (이름 첫 글자) */
  avatarInitial: string;
}

interface Props {
  profile: UserProfile;
}

export default function UserProfileSection({ profile }: Props) {
  return (
    <div className="flex items-center gap-[14px] px-[20px] py-[20px]">
      {/* 아바타 — gradient + 흰 이니셜 */}
      <div
        className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-white text-[17px] font-bold flex-shrink-0 select-none"
        style={{ background: 'linear-gradient(135deg, #1D2B53, #2A3D70)' }}
        aria-label={`${profile.name} 프로필`}
      >
        {profile.avatarInitial}
      </div>

      {/* 이름 + 이메일·가입일 */}
      <div className="min-w-0">
        <p className="text-[17px] font-bold text-fg">{profile.name}</p>
        <p className="text-[12px] text-fg-muted mt-[2px] truncate">
          {profile.email} · {profile.since}
        </p>
      </div>
    </div>
  );
}

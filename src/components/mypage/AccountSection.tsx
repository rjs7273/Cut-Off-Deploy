/* ─────────────────────────────────────────────────────────────────
   CMP-MY-009 · AccountSection
   로그인 사용자 전용 — 로그아웃 + 탈퇴하기.

   초안 HTML 참조:
     로그아웃: setting-row 패턴
     탈퇴하기: padding 0 20px 20px, h-40px, transparent border-none,
               14px, color #CC3333
   ───────────────────────────────────────────────────────────────── */
import { SettingRow } from './_shared';

interface Props {
  onLogout: () => void;
  onWithdraw: () => void;
}

export default function AccountSection({ onLogout, onWithdraw }: Props) {
  return (
    <div className="border-b border-line py-[8px]">
      <SettingRow label="로그아웃" showArrow onClick={onLogout} />
      <div className="px-[20px] pb-[20px]">
        <button
          className="w-full h-[40px] mt-[8px] bg-transparent border-none text-[14px] text-[#CC3333] font-sans cursor-pointer"
          onClick={onWithdraw}
        >
          탈퇴하기
        </button>
      </div>
    </div>
  );
}

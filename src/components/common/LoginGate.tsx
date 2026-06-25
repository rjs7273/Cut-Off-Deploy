/* ─────────────────────────────────────────────────────────────────
   LoginGate  (CMP-CONTENT-001)
   ─────────────────────────────────────────────────────────────────
   비회원 접근 시 로그인 필요 안내와 로그인 버튼을 표시한다.
   저장한 영상 / 시청 기록 화면 공통 사용.

   초안 HTML 클래스: .screen-gate / .gate-icon / .gate-title / .gate-desc
   ───────────────────────────────────────────────────────────────── */

interface LoginGateProps {
  /** 기능 이름 ex) "시청 기록", "저장한 영상" */
  title: string;
  /** 로그인 유도 안내 문구 (줄바꿈 포함 가능) */
  description: string;
  /** 아이콘 슬롯 — SVG 노드 또는 이모지 */
  icon?: React.ReactNode;
  /** 로그인하기 버튼 클릭 */
  onClickLogin: () => void;
}

export default function LoginGate({
  title,
  description,
  icon,
  onClickLogin,
}: LoginGateProps) {
  return (
    /* .screen-gate */
    <div className="flex-1 flex flex-col items-center justify-center px-[28px] py-[40px] text-center gap-[10px]">
      {/* .gate-icon */}
      {icon && (
        <div className="text-fg-muted mb-[6px] flex items-center justify-center">
          {icon}
        </div>
      )}

      {/* .gate-title */}
      <p className="text-[18px] font-bold text-fg tracking-[-0.4px]">
        {title}
      </p>

      {/* .gate-desc */}
      <p
        className="text-[14px] text-fg-muted leading-[1.65] mb-[8px]"
        dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br/>') }}
      />

      {/* 로그인하기 버튼 — .btn-primary, max-width 280px */}
      <button
        type="button"
        onClick={onClickLogin}
        className="w-full max-w-[280px] h-[52px] bg-navy text-white rounded-app-md text-[16px] font-semibold active:opacity-80 transition-opacity"
      >
        로그인하기
      </button>
    </div>
  );
}

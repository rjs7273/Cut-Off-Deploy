/* ─────────────────────────────────────────────────────────────────
   마이페이지 내부 레이아웃 헬퍼
   외부 공개용이 아닌 mypage 컴포넌트 전용.

   SettingSection : 섹션 그룹 래퍼 (border-bottom + 레이블)
   SettingRow     : 좌측 텍스트 + 우측 콘텐츠 행
   ───────────────────────────────────────────────────────────────── */

/** 설정 섹션 — border-bottom + optional 레이블 */
export function SettingSection({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-line py-[8px]">
      {label && (
        <p className="text-[11px] font-semibold text-fg-subtle uppercase tracking-[0.5px] px-[20px] pt-[10px] pb-[4px]">
          {label}
        </p>
      )}
      {children}
    </div>
  );
}

/** 설정 행 — 좌측 텍스트 + 우측 슬롯 + 선택적 화살표 */
export function SettingRow({
  label,
  right,
  showArrow = false,
  onClick,
  labelStyle,
}: {
  label: string;
  right?: React.ReactNode;
  showArrow?: boolean;
  onClick?: () => void;
  labelStyle?: string;
}) {
  return (
    <div
      className={[
        'flex items-center justify-between px-[20px] py-[13px]',
        onClick ? 'cursor-pointer hover:bg-surface-sub active:bg-surface-sub transition-colors' : '',
      ].join(' ')}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      <span className={`text-[15px] text-fg ${labelStyle ?? ''}`}>{label}</span>
      <div className="flex items-center gap-[6px] text-[13px] text-fg-muted">
        {right}
        {showArrow && (
          <span className="text-[14px] text-fg-subtle">›</span>
        )}
      </div>
    </div>
  );
}

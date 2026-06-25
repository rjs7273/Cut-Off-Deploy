/* ─────────────────────────────────────────────────────────────────
   RestrictedPage  (CMP-RESTRICT-001)
   ─────────────────────────────────────────────────────────────────
   앱 사용 제한 화면. URL: /restricted
   서버 응답 지연 / 네트워크 오류 시 표시 (AppLayout 미사용)

   초안 HTML 참조:
     #screen-restricted / .restricted-wrap / .restricted-status-tag
     .restricted-icon-box / .restricted-title / .restricted-desc
     .restricted-retry-btn / .restricted-info
   ───────────────────────────────────────────────────────────────── */
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';

function RestrictedIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 3l18 18" stroke="#E67E00" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M10.67 6.45A9.96 9.96 0 0 1 12 6.3c3.4 0 6.44 1.69 8.3 4.27"
        stroke="#E67E00"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.45"
      />
      <path
        d="M3.7 10.57A9.96 9.96 0 0 0 3 11c-.06.07 0 0 0 0"
        stroke="#E67E00"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M6.53 13.42A5.97 5.97 0 0 1 10 12.3"
        stroke="#E67E00"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M17.47 13.42A5.97 5.97 0 0 0 14 12.3"
        stroke="#E67E00"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="12" cy="18" r="1.2" fill="#E67E00" />
    </svg>
  );
}

export default function RestrictedPage() {
  const navigate = useNavigate();

  const handleRetry = useCallback(() => {
    navigate('/splash', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-dvh bg-surface flex flex-col pt-safe pb-safe">
      {/* .restricted-wrap — flex-1, center, px:32px, pt:48px, pb:40px */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-12 pb-10 text-center">
        {/* .restricted-status-tag */}
        <div className="restricted-status-tag inline-flex items-center gap-[5px] px-[10px] py-1 mb-5 rounded-[20px] text-[12px] font-semibold bg-[#FFF3E0] text-[#E67E00]">
          <span
            className="restricted-status-dot w-[6px] h-[6px] rounded-full bg-[#E67E00]"
            style={{ animation: 'pulse 1.2s infinite' }}
          />
          서버 응답 지연
        </div>

        {/* .restricted-icon-box */}
        <div className="restricted-icon-box w-[76px] h-[76px] bg-[#FFF3E0] rounded-[24px] flex items-center justify-center mb-7">
          <RestrictedIcon />
        </div>

        {/* .restricted-title */}
        <h1 className="text-[20px] font-bold text-fg tracking-[-0.4px] mb-3">
          앱을 사용할 수 없어요
        </h1>

        {/* .restricted-desc */}
        <p className="text-[14px] text-fg-muted leading-[1.75] mb-9">
          인터넷 연결이 원활하지 않거나
          <br />
          서버 응답이 지연되고 있어요.
          <br />
          잠시 후 다시 시도해 주세요.
        </p>

        {/* .restricted-retry-btn */}
        <Button variant="primary" size="lg" fullWidth onClick={handleRetry}>
          다시 시도
        </Button>

        {/* .restricted-info */}
        <p className="text-[12px] text-fg-subtle leading-[1.65] mt-4">
          문제가 계속되면 Wi-Fi 또는 모바일 데이터
          <br />
          연결 상태를 확인해 주세요.
        </p>
      </div>
    </div>
  );
}

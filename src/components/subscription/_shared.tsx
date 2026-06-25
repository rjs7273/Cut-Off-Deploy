/* eslint-disable react-refresh/only-export-components */
/* ── 구독 바텀시트 공통 UI ── */

export interface BenefitItem {
  bold: string;
  rest: string;
}

export const SUBSCRIPTION_BENEFITS: BenefitItem[] = [
  { bold: '오늘의 다른 추천', rest: ' 전체 열람 — 오늘 고른 영상 외 추가 추천' },
  { bold: '저장 & 시청 기록', rest: ' — 기기 간 동기화 포함' },
  { bold: '카테고리 전체 열람', rest: ' — 관심 주제별 영상 목록 무제한' },
];

export const LOGIN_UPSELL_BENEFITS: BenefitItem[] = [
  { bold: '기기 간 설정 동기화', rest: ' — 어느 기기에서든 이어서 사용' },
  { bold: '오늘의 다른 추천', rest: ' 전체 열람 — 구독 시 이용 가능' },
  { bold: '저장 & 시청 기록', rest: ' — 구독 시 이용 가능' },
  { bold: '카테고리 전체 열람', rest: ' — 구독 시 이용 가능' },
];

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2 6l3 3 5-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SubscriptionBenefitList({ items }: { items: BenefitItem[] }) {
  return (
    <div className="bg-surface-sub rounded-app-md px-4 py-[14px] mb-5 flex flex-col gap-[10px]">
      {items.map((item) => (
        <div key={item.bold} className="flex items-start gap-[10px]">
          <div className="w-[18px] h-[18px] bg-navy rounded-full flex items-center justify-center text-white flex-shrink-0 mt-px">
            <CheckIcon />
          </div>
          <p className="flex-1 text-[13px] text-fg leading-[1.5]">
            <strong className="text-navy font-semibold">{item.bold}</strong>
            {item.rest}
          </p>
        </div>
      ))}
    </div>
  );
}

export function SubPriceRow({ showFreeTrial = true }: { showFreeTrial?: boolean }) {
  return (
    <div className="text-center mb-4">
      <p className="text-[22px] font-bold text-fg tracking-[-0.5px]">
        월 4,900원 <span className="text-[14px] font-normal text-fg-muted">/ 월</span>
      </p>
      <p className="text-[12px] text-fg-subtle mt-[3px]">
        {showFreeTrial ? '언제든지 해지 가능 · 첫 달 무료 체험' : '언제든지 해지 가능'}
      </p>
    </div>
  );
}

export function SubUpsellIcon({ variant }: { variant: 'subscribe' | 'unsubscribe' | 'login' }) {
  if (variant === 'unsubscribe') {
    return (
      <div className="w-14 h-14 bg-[#FFF3F3] rounded-[18px] flex items-center justify-center mx-auto mb-4">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="#CC3333" strokeWidth="1.8" />
          <path d="M9 9l6 6M15 9l-6 6" stroke="#CC3333" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (variant === 'login') {
    return (
      <div className="w-14 h-14 bg-navy rounded-[18px] flex items-center justify-center text-white mx-auto mb-4">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-14 h-14 bg-navy rounded-[18px] flex items-center justify-center text-white mx-auto mb-4">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M2.5 9h19l-9.5 12L2.5 9Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M2.5 9l4-5h11l4 5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 4 6 9l6 12 6-12-2.5-5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

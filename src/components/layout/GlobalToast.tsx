import { useOverlayStore } from '@/store/overlayStore';

/* ─────────────────────────────────────────────────────────────────
   GlobalToast  (CMP-UI-007)
   ─────────────────────────────────────────────────────────────────
   AppLayout 내부에 마운트되어 전역 Toast 큐를 렌더링한다.
   ───────────────────────────────────────────────────────────────── */
export default function GlobalToast() {
  const { toasts } = useOverlayStore();

  if (toasts.length === 0) return null;

  /* 최신 토스트 1개만 표시 */
  const latest = toasts[toasts.length - 1];

  return (
    <div
      role="status"
      aria-live="polite"
      className="
        fixed left-5 right-5 z-[70]
        pb-safe
        pointer-events-none
      "
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 34px)' }}
    >
      <div
        key={latest.id}
        className="
          w-full
          bg-[rgba(17,17,17,0.92)]
          text-white text-[13px] leading-[1.4]
          px-[14px] py-[12px]
          rounded-[12px]
          animate-[fade-in_0.2s_ease_both]
        "
      >
        {latest.message}
      </div>
    </div>
  );
}

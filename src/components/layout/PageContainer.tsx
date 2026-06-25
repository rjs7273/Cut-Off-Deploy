import type { PageContainerProps } from '@/types/layout';

/* ─────────────────────────────────────────────────────────────────
   PageContainer  (CMP-APP-002)
   ─────────────────────────────────────────────────────────────────
   모든 메인 앱 화면을 감싸는 래퍼.
   - 모바일 WebView 기준 전체 높이를 채움
   - 내부 스크롤 영역을 flex column으로 구성
   - Capacitor Safe Area 대응 (safeTop / safeBottom prop)
   ───────────────────────────────────────────────────────────────── */
export default function PageContainer({
  children,
  className = '',
  scrollable = true,
  safeTop = false,
  safeBottom = false,
}: PageContainerProps) {
  return (
    <div
      className={[
        'flex flex-col w-full h-full bg-surface text-fg',
        scrollable ? 'overflow-y-auto overflow-x-hidden' : 'overflow-hidden',
        safeTop ? 'pt-safe' : '',
        safeBottom ? 'pb-safe' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}

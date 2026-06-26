import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, Bell, User } from 'lucide-react';
import { useOverlayStore } from '@/store/overlayStore';
import type { AppHeaderProps } from '@/types/layout';

/* ─────────────────────────────────────────────────────────────────
   AppHeader  (CMP-APP-003)
   ─────────────────────────────────────────────────────────────────
   화면별 변형을 단일 컴포넌트로 처리한다.

   variant="home"
     └─ 햄버거 메뉴 | Cut-off 로고 | 알림 + 마이페이지 아이콘

   variant="default"  (기본값)
     └─ 뒤로가기 | 페이지 제목 | 선택 아이콘

   variant="bare"
     └─ 배경/테두리 없음 — 온보딩 플로우 내부에서 최소 헤더 필요 시
   ───────────────────────────────────────────────────────────────── */
export default function AppHeader({
  title,
  variant = 'default',
  showBack = false,
  showMenu = false,
  showNotification = false,
  showMyPage = false,
  onBack,
  onOpenDrawer,
  onClickMyPage,
  onClickNotification,
  noBorder = false,
}: AppHeaderProps) {
  const navigate = useNavigate();
  const openDrawer = useOverlayStore((s) => s.openDrawer);

  function handleBack() {
    if (onBack) onBack();
    else navigate(-1);
  }

  function handleOpenDrawer() {
    if (onOpenDrawer) onOpenDrawer();
    else openDrawer();
  }

  /* ── 배경·테두리 스타일 ── */
  const baseStyle =
    variant === 'bare'
      ? ''
      : `bg-surface ${noBorder ? '' : 'border-b border-line'}`;

  return (
    <header
      className={[
        'flex-shrink-0 sticky top-0 z-[5]',
        'pt-safe',
        baseStyle,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-center justify-between h-[56px] px-5">
      {/* ── 좌측 영역 ── */}
      <div className="flex items-center min-w-[40px]">
        {/* Home variant: 햄버거 메뉴 */}
        {variant === 'home' && (
          <button
            className="w-[22px] h-[22px] flex items-center justify-center text-fg-muted"
            aria-label="메뉴 열기"
            onClick={handleOpenDrawer}
          >
            <Menu size={22} strokeWidth={1.8} />
          </button>
        )}

        {/* Default/bare variant: 뒤로가기 버튼 */}
        {variant !== 'home' && showBack && (
          <button
            className="w-[36px] h-[36px] -ml-1 flex items-center justify-center text-fg"
            aria-label="뒤로가기"
            onClick={handleBack}
          >
            <ArrowLeft size={22} strokeWidth={1.8} />
          </button>
        )}

        {/* showMenu: default variant에서 드로어 열기 */}
        {variant !== 'home' && showMenu && !showBack && (
          <button
            className="w-[22px] h-[22px] flex items-center justify-center text-fg-muted"
            aria-label="메뉴 열기"
            onClick={handleOpenDrawer}
          >
            <Menu size={22} strokeWidth={1.8} />
          </button>
        )}
      </div>

      {/* ── 중앙 영역 ── */}
      <div className="flex-1 flex items-center justify-center">
        {variant === 'home' ? (
          /* 홈: 로고 타이포 — 탭 시 메인 홈으로 이동 */
          <button
            type="button"
            className="text-[18px] font-bold text-fg tracking-[-0.5px] bg-transparent border-0 p-0 cursor-pointer"
            aria-label="홈으로 이동"
            onClick={() => navigate('/home')}
          >
            Cut<span className="text-navy">-off</span>
          </button>
        ) : (
          /* 기본: 페이지 제목 */
          title && (
            <span className="text-[17px] font-semibold text-fg tracking-[-0.3px] line-clamp-1">
              {title}
            </span>
          )
        )}
      </div>

      {/* ── 우측 영역 ── */}
      <div className="flex items-center gap-[18px] min-w-[40px] justify-end">
        {showNotification && (
          <button
            className="w-[22px] h-[22px] flex items-center justify-center text-fg-muted"
            aria-label="알림"
            onClick={onClickNotification}
          >
            <Bell size={20} strokeWidth={1.8} />
          </button>
        )}

        {showMyPage && (
          <button
            className="w-[22px] h-[22px] flex items-center justify-center text-fg-muted"
            aria-label="마이페이지"
            onClick={onClickMyPage ?? (() => navigate('/mypage'))}
          >
            <User size={20} strokeWidth={1.8} />
          </button>
        )}
      </div>
      </div>
    </header>
  );
}

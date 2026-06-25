import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Drawer from '@/components/navigation/Drawer';
import GlobalToast from '@/components/layout/GlobalToast';
import SessionExpiredModal from '@/components/common/SessionExpiredModal';
import SubscribeBottomSheet from '@/components/subscription/SubscribeBottomSheet';
import LoginUpsellBottomSheet from '@/components/subscription/LoginUpsellBottomSheet';
import SaveFolderBottomSheet from '@/components/saved/SaveFolderBottomSheet';
import { useOverlayStore } from '@/store/overlayStore';

/* ─────────────────────────────────────────────────────────────────
   AppLayout  (CMP-APP-001)
   ─────────────────────────────────────────────────────────────────
   - 메인 앱 라우트의 루트 레이아웃
   - Drawer / Toast 등 전역 오버레이 슬롯을 포함
   - Capacitor WebView 기준: 100dvh 고정, overflow hidden
   ───────────────────────────────────────────────────────────────── */
export default function AppLayout() {
  const { isDrawerOpen, closeDrawer } = useOverlayStore();
  const location = useLocation();

  /* 라우트 변경 시 Drawer 자동 닫기 */
  useEffect(() => {
    closeDrawer();
  }, [location.pathname, closeDrawer]);

  return (
    <div
      className="relative w-full overflow-hidden bg-surface text-fg"
      style={{ height: '100dvh' }}
    >
      {/* ── 사이드 드로어 ── */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        activePath={location.pathname}
      />

      {/* ── 페이지 콘텐츠 (React Router Outlet) ── */}
      <div className="w-full h-full">
        <Outlet />
      </div>

      {/* ── 전역 Toast ── */}
      <GlobalToast />

      {/* ── 전역 오버레이 ── */}
      <SessionExpiredModal />
      <SubscribeBottomSheet />
      <LoginUpsellBottomSheet />
      <SaveFolderBottomSheet />
    </div>
  );
}

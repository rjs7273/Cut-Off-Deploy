/* ─────────────────────────────────────────────
   Layout 관련 타입 정의
   ───────────────────────────────────────────── */

/** AppHeader 컴포넌트 Props */
export interface AppHeaderProps {
  /** 화면 중앙에 표시할 페이지 제목 (variant="default" 시 사용) */
  title?: string;
  /**
   * 헤더 변형
   * - home     : 햄버거 메뉴 | 로고 | 알림+마이페이지 아이콘
   * - default  : 뒤로가기 | 제목 | 선택 아이콘
   * - bare     : 배경·테두리 없음 (온보딩 플로우 내부용)
   */
  variant?: 'home' | 'default' | 'bare';
  /** 뒤로가기 버튼 표시 여부 */
  showBack?: boolean;
  /** 햄버거 메뉴 버튼 표시 여부 */
  showMenu?: boolean;
  /** 알림 아이콘 표시 여부 */
  showNotification?: boolean;
  /** 마이페이지 아이콘 표시 여부 */
  showMyPage?: boolean;
  /** 뒤로가기 클릭 핸들러 (undefined 시 navigate(-1) 실행) */
  onBack?: () => void;
  /** 햄버거 메뉴 클릭 → Drawer 열기 */
  onOpenDrawer?: () => void;
  /** 마이페이지 아이콘 클릭 */
  onClickMyPage?: () => void;
  /** 알림 아이콘 클릭 */
  onClickNotification?: () => void;
  /** 헤더 하단 border-bottom 숨김 여부 */
  noBorder?: boolean;
}

/** PageContainer 컴포넌트 Props */
export interface PageContainerProps {
  children: React.ReactNode;
  /** 추가 className */
  className?: string;
  /**
   * 스크롤 허용 여부 (기본 true)
   * false 시 overflow-hidden (바텀시트 내부 등에서 사용)
   */
  scrollable?: boolean;
  /** iOS 상단 Safe Area 패딩 추가 여부 */
  safeTop?: boolean;
  /** iOS 하단 Safe Area 패딩 추가 여부 */
  safeBottom?: boolean;
}

/** Drawer 컴포넌트 Props */
export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  /** 현재 활성 화면 경로 (active 스타일 표시용) */
  activePath?: string;
}

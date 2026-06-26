import { createBrowserRouter, Navigate } from 'react-router-dom';

/* ── 레이아웃 ── */
import AppLayout from '@/components/layout/AppLayout';

/* ── 온보딩 플로우 (AppLayout 미사용 — 드로어 없음) ── */
import SplashPage from '@/pages/SplashPage';
import LoginPage from '@/pages/LoginPage';
import OnboardPage from '@/pages/OnboardPage';
import CategoryPage from '@/pages/CategoryPage';
import NotificationPage from '@/pages/NotificationPage';
import RestrictedPage from '@/pages/RestrictedPage';

/* ── 메인 앱 (AppLayout 내부 — 드로어 + 전역 오버레이 포함) ── */
import HomePage from '@/pages/HomePage';
import CategoryListPage from '@/pages/CategoryListPage';
import MyPage from '@/pages/MyPage';
import SavedPage from '@/pages/SavedPage';
import HistoryPage from '@/pages/HistoryPage';
import PolicyPage from '@/pages/PolicyPage';
import FeedbackPage from '@/pages/FeedbackPage';
import CategoryEditPage from '@/pages/CategoryEditPage';
import VideoDetailPage from '@/pages/VideoDetailPage';

/* ── 개발 전용 ── */
import DevUIPage from '@/pages/DevUIPage';

/* ─────────────────────────────────────────────────────────────────
   라우트 구조

   /                         → /splash (리다이렉트)

   ── 온보딩 플로우 (독립 레이아웃) ──────────────────────────────
   /splash                   스플래시
   /login                    로그인
   /onboard                  온보딩 슬라이드
   /category                 관심사 초기 설정
   /notification             알림 설정
   /restricted               앱 사용 제한 (서버 지연/네트워크 오류)

   ── 메인 앱 (AppLayout 공유) ────────────────────────────────────
   /home                     메인 홈
   /catlist                  카테고리 목록
   /mypage                   마이페이지
   /saved                    저장한 영상
   /history                  시청 기록
   /terms                    이용약관
   /privacy                  개인정보처리방침
   /feedback                 의견 보내기
   /category-edit            관심사 변경 (마이페이지 → 관심사 설정)
   /video/:videoId           영상 상세
   ───────────────────────────────────────────────────────────────── */
export const router = createBrowserRouter([
  /* 기본 리다이렉트 */
  { path: '/', element: <Navigate to="/splash" replace /> },

  /* ── 온보딩 플로우 ── */
  { path: '/splash',       element: <SplashPage /> },
  { path: '/login',        element: <LoginPage /> },
  { path: '/onboard',      element: <OnboardPage /> },
  { path: '/category',     element: <CategoryPage /> },
  { path: '/notification', element: <NotificationPage /> },
  { path: '/restricted',   element: <RestrictedPage /> },

  /* ── 메인 앱 (AppLayout 공유) ── */
  {
    element: <AppLayout />,
    children: [
      { path: '/home',    element: <HomePage /> },
      { path: '/catlist', element: <CategoryListPage /> },
      { path: '/mypage',  element: <MyPage /> },
      { path: '/saved',   element: <SavedPage /> },
      { path: '/history', element: <HistoryPage /> },
      { path: '/terms',    element: <PolicyPage policyType="terms" /> },
      { path: '/privacy',  element: <PolicyPage policyType="privacy" /> },
      { path: '/feedback',       element: <FeedbackPage /> },
      { path: '/category-edit', element: <CategoryEditPage /> },
      { path: '/video/:videoId',  element: <VideoDetailPage /> },
      { path: '/dev-ui',        element: <DevUIPage /> },
    ],
  },
]);

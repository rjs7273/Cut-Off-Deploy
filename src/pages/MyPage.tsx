import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import AppHeader from '@/components/layout/AppHeader';
import GuestProfileSection from '@/components/mypage/GuestProfileSection';
import UserProfileSection from '@/components/mypage/UserProfileSection';
import type { UserProfile } from '@/components/mypage/UserProfileSection';
import MyContentMenu from '@/components/mypage/MyContentMenu';
import SubscriptionSection from '@/components/mypage/SubscriptionSection';
import PersonalSettingsSection from '@/components/mypage/PersonalSettingsSection';
import SupportMenuSection from '@/components/mypage/SupportMenuSection';
import AccountSection from '@/components/mypage/AccountSection';
import WithdrawConfirmModal from '@/components/mypage/WithdrawConfirmModal';
import UnsubscribeBottomSheet from '@/components/subscription/UnsubscribeBottomSheet';
import NotifPermPopup from '@/components/notification/NotifPermPopup';
import NotifPermDeniedModal from '@/components/notification/NotifPermDeniedModal';
import { useOverlayStore } from '@/store/overlayStore';
import { useNotifPermission } from '@/hooks/useNotifPermission';
import { useAuthStore } from '@/store/authStore';
import { performWithdraw } from '@/api/services/auth';
import { updateNotificationSetting } from '@/api/services/user';
import { useUserPrefsStore } from '@/store/userPrefsStore';
import { useSavedStore } from '@/store/savedStore';

/* ─────────────────────────────────────────────────────────────────
   MyPage  (CMP-MY-001)
   ─────────────────────────────────────────────────────────────────
   마이페이지.

   목업 상태:
     isLoggedIn    true (로그인 상태)
     userTier      'free' (미구독)
     notifAgree    false
     interests     ['브랜딩', '마케팅']

   TODO: useAuth 연동 후 isLoggedIn / userTier 실제 상태로 교체
   ───────────────────────────────────────────────────────────────── */

function interestSummary(interests: string[]): string {
  if (interests.length === 0) return '설정 안 됨';
  if (interests.length <= 2) return interests.join(', ');
  return `${interests[0]}, ${interests[1]} 외`;
}

export default function MyPage() {
  /* authStore 구독 — 로그인/구독/유저정보 변경 즉시 재렌더링 */
  const isLoggedIn   = useAuthStore((s) => s.isLoggedIn);
  const isSubscribed = useAuthStore((s) => s.isSubscribed);
  const authUserInfo = useAuthStore((s) => s.userInfo);
  const subscribedAt = useAuthStore((s) => s.subscribedAt);
  const authLogout   = useAuthStore((s) => s.logout);
  const userTier: 'free' | 'subscribed' = isSubscribed ? 'subscribed' : 'free';
  const notifEnabled = useUserPrefsStore((s) => s.notificationEnabled);
  const setNotificationEnabled = useUserPrefsStore((s) => s.setNotificationEnabled);
  const selectedCategories = useUserPrefsStore((s) => s.selectedCategories);
  const savedCount = useSavedStore((s) => s.savedVideoIds.length);
  const [notifAgree, setNotifAgree] = useState(() => notifEnabled);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const {
    permPopupOpen,
    deniedModalOpen,
    requestPermission,
    handlePermAllow,
    handlePermDeny,
    handleDeniedModalClose,
  } = useNotifPermission();

  /* 가입일 포맷: ISO → "YYYY년 M월부터" */
  function formatJoinedAt(iso: string): string {
    const d = new Date(iso);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월부터`;
  }

  /* UserInfo (백엔드 응답) → UserProfile (UI 표시용) 변환
     avatarInitial: nickname 첫 글자 사용 */
  const profile: UserProfile = authUserInfo
    ? {
        name:          authUserInfo.nickname,
        email:         authUserInfo.email,
        since:         formatJoinedAt(authUserInfo.joinedAt),
        avatarInitial: authUserInfo.nickname.charAt(0),
      }
    : { name: '', email: '', since: '', avatarInitial: '?' };

  const interests = selectedCategories.flatMap((c) => c.subCategories);

  const navigate = useNavigate();
  const showToast = useOverlayStore((s) => s.showToast);
  const openSubscribeSheet    = useOverlayStore((s) => s.openSubscribeSheet);
  const openUnsubscribeSheet  = useOverlayStore((s) => s.openUnsubscribeSheet);
  const openLoginUpsellSheet  = useOverlayStore((s) => s.openLoginUpsellSheet);

  /* ── 핸들러 ── */
  function handleLoginRequest() {
    openLoginUpsellSheet('mypage');
  }

  function handleClickInterest() {
    navigate('/category-edit');
  }

  function handleClickSubscribe() {
    openSubscribeSheet('mypage');
  }

  function handleClickUnsubscribe() {
    openUnsubscribeSheet();
  }

  function handleLogout() {
    authLogout().then(() => showToast('로그아웃됐습니다.'));
  }

  function handleWithdrawConfirm() {
    setIsWithdrawOpen(false);
    performWithdraw()
      .then(() => showToast('탈퇴가 완료됐습니다.'))
      .catch(() => showToast('탈퇴 처리에 실패했습니다.'));
  }

  return (
    <PageContainer scrollable>
      <AppHeader variant="default" title="마이페이지" showBack />

      {/* 페이지 제목 (HTML 초안의 .mypage-header) */}
      <div className="px-[20px] pt-[16px] pb-[16px]">
        <h1 className="text-[20px] font-bold text-fg">마이페이지</h1>
      </div>

      {/* ── 비회원 프로필 ── */}
      {!isLoggedIn && (
        <GuestProfileSection onClickLogin={handleLoginRequest} />
      )}

      {/* ── 로그인 사용자 프로필 + 내 콘텐츠 + 구독 ── */}
      {isLoggedIn && (
        <>
          <UserProfileSection profile={profile} />
          <MyContentMenu
            savedCount={savedCount}
            onClickSaved={() => navigate('/saved')}
            onClickHistory={() => navigate('/history')}
          />
          <SubscriptionSection
            userTier={userTier}
            subscribedSince={subscribedAt ? formatJoinedAt(subscribedAt) : undefined}
            onClickSubscribe={handleClickSubscribe}
            onClickUnsubscribe={handleClickUnsubscribe}
          />
        </>
      )}

      {/* ── 개인 설정 + 앱 설정 (모든 사용자) ── */}
      <PersonalSettingsSection
        interestSummary={interestSummary(interests)}
        notifAgree={notifAgree}
        onClickInterest={handleClickInterest}
        onToggleNotification={() => {
          if (!notifAgree) {
            requestPermission(
              (registration) => {
                setNotifAgree(true);
                updateNotificationSetting({
                  alarmAgreed: true,
                  ...(registration.fcmToken ? { fcmToken: registration.fcmToken } : {}),
                  deviceType: registration.deviceType,
                }).catch(() => {});
              },
              () => { /* 거부 — 토글 OFF 유지 */ },
            );
          } else {
            setNotificationEnabled(false);
            setNotifAgree(false);
            updateNotificationSetting({ alarmAgreed: false }).catch(() => {});
          }
        }}
      />

      {/* ── 지원 (모든 사용자) ── */}
      <SupportMenuSection
        onClickFeedback={() => navigate('/feedback')}
        onClickTerms={() => navigate('/terms')}
        onClickPrivacy={() => navigate('/privacy')}
      />

      {/* ── 계정 (로그인 사용자) ── */}
      {isLoggedIn && (
        <AccountSection
          onLogout={handleLogout}
          onWithdraw={() => setIsWithdrawOpen(true)}
        />
      )}

      {/* ── 탈퇴 확인 모달 ── */}
      <WithdrawConfirmModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        onConfirm={handleWithdrawConfirm}
      />

      <UnsubscribeBottomSheet />

      {/* ── 알림 권한 팝업 (OFF → ON 시) ── */}
      <NotifPermPopup
        isOpen={permPopupOpen}
        onAllow={handlePermAllow}
        onDeny={handlePermDeny}
      />

      {/* ── 알림 권한 거부 안내 모달 ── */}
      <NotifPermDeniedModal
        isOpen={deniedModalOpen}
        onClose={handleDeniedModalClose}
      />
    </PageContainer>
  );
}

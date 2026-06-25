/* ─────────────────────────────────────────────────────────────────
   SubscribeBottomSheet  (CMP-SUB-001)
   ─────────────────────────────────────────────────────────────────
   구독 혜택 안내 + 가격 + "무료로 시작하기" CTA.
   AppLayout 전역 슬롯. overlayStore.subscribeSheetSource 로 개폐.

   초안 HTML 참조: #sub-upsell-sheet
   ───────────────────────────────────────────────────────────────── */
import { useNavigate } from 'react-router-dom';
import BottomSheet from '@/components/ui/BottomSheet';
import Button from '@/components/ui/Button';
import { useOverlayStore } from '@/store/overlayStore';
import { useSubscription } from '@/hooks/useSubscription';
import {
  SUBSCRIPTION_BENEFITS,
  SubPriceRow,
  SubUpsellIcon,
  SubscriptionBenefitList,
} from './_shared';

export default function SubscribeBottomSheet() {
  const navigate = useNavigate();
  const subscribeSheetSource = useOverlayStore((s) => s.subscribeSheetSource);
  const closeSubscribeSheet  = useOverlayStore((s) => s.closeSubscribeSheet);
  const showToast            = useOverlayStore((s) => s.showToast);
  const { action, purchase, restore } = useSubscription();

  const isOpen = subscribeSheetSource !== null;

  async function handleSubscribe() {
    try {
      await purchase();
      closeSubscribeSheet();
      showToast('구독이 시작됐습니다. 관심사를 추가로 선택해 주세요.');
      navigate('/category?mode=subscribe');
    } catch (error) {
      const message = error instanceof Error && error.name.includes('Cancelled')
        ? '구독이 취소되었습니다.'
        : '구독을 시작하지 못했습니다. 상품 설정을 확인해 주세요.';
      showToast(message);
    }
  }

  async function handleRestore() {
    try {
      await restore();
      closeSubscribeSheet();
      showToast('구독 정보를 복원했습니다.');
    } catch {
      showToast('복원할 구독 정보를 찾지 못했습니다.');
    }
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={closeSubscribeSheet} showClose>
      <div className="px-5 pt-2 pb-6">
        <SubUpsellIcon variant="subscribe" />

        <h2 className="text-[20px] font-bold text-fg text-center tracking-[-0.5px] mb-[6px]">
          Cut off 구독
        </h2>
        <p className="text-[14px] text-fg-muted text-center leading-[1.6] mb-5">
          오늘의 한 편, 그 이상을
          <br />
          경험하고 싶다면.
        </p>

        <SubscriptionBenefitList items={SUBSCRIPTION_BENEFITS} />
        <SubPriceRow />

        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={action === 'purchase'}
          disabled={action !== null}
          onClick={handleSubscribe}
        >
          무료로 시작하기 (첫 달 무료)
        </Button>
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          loading={action === 'restore'}
          disabled={action !== null}
          onClick={handleRestore}
          className="mt-2"
        >
          이전 구독 복원하기
        </Button>
      </div>
    </BottomSheet>
  );
}

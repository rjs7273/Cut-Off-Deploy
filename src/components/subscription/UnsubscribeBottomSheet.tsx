/* ─────────────────────────────────────────────────────────────────
   UnsubscribeBottomSheet  (CMP-SUB-003)
   ─────────────────────────────────────────────────────────────────
   구독 취소 전 혜택 손실 안내. MyPage 에서 렌더.
   overlayStore.isUnsubscribeSheetOpen 으로 개폐.

   초안 HTML 참조: #unsub-sheet
   ───────────────────────────────────────────────────────────────── */
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

export default function UnsubscribeBottomSheet() {
  const isOpen = useOverlayStore((s) => s.isUnsubscribeSheetOpen);
  const closeUnsubscribeSheet = useOverlayStore((s) => s.closeUnsubscribeSheet);
  const showToast = useOverlayStore((s) => s.showToast);
  const { action, openManagement } = useSubscription();

  async function handleConfirmUnsubscribe() {
    try {
      await openManagement();
      closeUnsubscribeSheet();
      showToast('스토어 구독 관리 화면에서 해지를 완료해 주세요.');
    } catch {
      showToast('구독 관리 화면을 열지 못했습니다.');
    }
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={closeUnsubscribeSheet} showClose>
      <div className="px-5 pt-2 pb-6">
        <SubUpsellIcon variant="unsubscribe" />

        <h2 className="text-[20px] font-bold text-fg text-center tracking-[-0.5px] mb-[6px]">
          정말 해지 하시겠어요?
        </h2>
        <p className="text-[14px] text-fg-muted text-center leading-[1.6] mb-5">
          해지하면 아래 혜택을 더 이상
          <br />
          이용할 수 없게 됩니다.
        </p>

        <SubscriptionBenefitList items={SUBSCRIPTION_BENEFITS} />
        <SubPriceRow showFreeTrial={false} />

        <div className="flex flex-col gap-2 pt-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={action === 'manage'}
            disabled={action !== null}
            className="!bg-[#CC3333] active:!bg-[#CC3333]/90 disabled:!bg-skel"
            onClick={handleConfirmUnsubscribe}
          >
            스토어에서 구독 관리하기
          </Button>
          <Button variant="secondary" size="lg" fullWidth onClick={closeUnsubscribeSheet}>
            돌아가기
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}

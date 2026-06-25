import { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import AppHeader from '@/components/layout/AppHeader';
import FeedbackTypeChips from '@/components/feedback/FeedbackTypeChips';
import FeedbackForm from '@/components/feedback/FeedbackForm';
import { useOverlayStore } from '@/store/overlayStore';
import { sendFeedback } from '@/api/services/feedback';
import { type FeedbackType, type FeedbackPayload } from '@/types/feedback';

/* ─────────────────────────────────────────────────────────────────
   FeedbackPage  (CMP-FB-001)
   ─────────────────────────────────────────────────────────────────
   의견 보내기 화면.

   상태:
     feedbackType    선택된 의견 유형 (기본: '개선 제안')
     isSubmitting    제출 중 플래그

   흐름:
     유형 선택 → 내용 입력 → 이메일 입력(선택) → 제출
     제출 성공 시 토스트 + 뒤로가기

   TODO: handleSubmit에서 실제 API POST /api/feedback 연동
   ───────────────────────────────────────────────────────────────── */
export default function FeedbackPage() {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('개선 제안');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useOverlayStore();

  async function handleSubmit(payload: FeedbackPayload) {
    setIsSubmitting(true);
    try {
      await sendFeedback(payload.type, payload.text);
      showToast('의견을 보냈습니다. 꼼꼼히 읽겠습니다!');
    } catch {
      showToast('전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageContainer scrollable={false}>
      <AppHeader variant="default" title="의견 보내기" showBack />

      <div className="flex-1 overflow-y-auto px-[20px] pt-[24px] pb-[40px]">
        {/* 페이지 제목 + 설명 */}
        <h1 className="text-[18px] font-bold text-fg tracking-[-0.4px] mb-[6px]">
          의견 보내기
        </h1>
        <p className="text-[13px] text-fg-muted leading-[1.6] mb-[24px]">
          불편한 점, 개선 아이디어, 버그 신고 등 무엇이든 편하게 남겨주세요.{'\n'}
          모든 의견을 꼼꼼히 읽고 있습니다.
        </p>

        {/* 유형 선택 */}
        <FeedbackTypeChips selected={feedbackType} onSelect={setFeedbackType} />

        {/* 내용 + 이메일 + 제출 버튼 */}
        <FeedbackForm
          feedbackType={feedbackType}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </div>
    </PageContainer>
  );
}

/* ─────────────────────────────────────────────────────────────────
   CMP-FB-003 · FeedbackForm
   의견 내용 + 이메일(선택) 입력 폼 + 제출 버튼.

   초안 HTML 참조:
     textarea: h-160px, border, radius-md, p-12px, 14px, resize-none, line-height:1.6
     email:    h-44px, border, radius-md, px-12px, 14px
     button:   btn-primary — opacity 0.45(비활성) / 1.0(활성)
   ───────────────────────────────────────────────────────────────── */
import { useState } from 'react';
import type { FeedbackType, FeedbackPayload } from '@/types/feedback';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_TEXT = 500;

interface Props {
  feedbackType: FeedbackType;
  isSubmitting: boolean;
  onSubmit: (payload: FeedbackPayload) => void;
}

export default function FeedbackForm({ feedbackType, isSubmitting, onSubmit }: Props) {
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');

  const emailTouched = email.length > 0;
  const isEmailValid = !emailTouched || EMAIL_RE.test(email);
  const isSubmitEnabled = text.trim().length > 0 && isEmailValid && !isSubmitting;

  function handleSubmit() {
    if (!isSubmitEnabled) return;
    onSubmit({
      type: feedbackType,
      text: text.trim(),
      email: emailTouched ? email : undefined,
    });
  }

  return (
    <>
      {/* ── 내용 ── */}
      <div className="mb-[14px]">
        <p className="text-[12px] font-semibold text-fg-muted mb-[6px]">내용</p>
        <textarea
          className="w-full h-[160px] border border-line rounded-[12px] p-[12px] text-[14px] text-fg bg-surface font-sans resize-none leading-[1.6] outline-none focus:border-navy transition-colors"
          placeholder="의견을 자유롭게 적어주세요."
          maxLength={MAX_TEXT}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <p className="text-right text-[11px] text-fg-subtle mt-[4px]">
          <span>{text.length}</span> / {MAX_TEXT}
        </p>
      </div>

      {/* ── 이메일 (선택) ── */}
      <div className="mb-[24px]">
        <p className="text-[12px] font-semibold text-fg-muted mb-[6px]">이메일 (선택)</p>
        <input
          type="email"
          className={[
            'w-full h-[44px] border rounded-[12px] px-[12px] text-[14px] text-fg bg-surface outline-none transition-colors',
            isEmailValid ? 'border-line focus:border-navy' : 'border-[#E53935] focus:border-[#E53935]',
          ].join(' ')}
          placeholder="예: hello@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* 이메일 형식 오류 메시지 */}
        {emailTouched && !isEmailValid && (
          <p className="text-[11px] text-[#E53935] mt-[4px]">
            올바른 이메일 형식을 입력해 주세요 (예: hello@example.com)
          </p>
        )}

        {/* 힌트 (정상 상태) */}
        {(!emailTouched || isEmailValid) && (
          <p className="text-[11px] text-fg-subtle mt-[5px]">
            입력하시면 처리 결과를 알려드립니다.
          </p>
        )}
      </div>

      {/* ── 제출 버튼 ── */}
      <button
        className={[
          'w-full h-[52px] rounded-[12px] text-[16px] font-semibold text-white transition-opacity',
          'bg-navy tracking-[0.2px]',
          isSubmitEnabled ? 'opacity-100 cursor-pointer' : 'opacity-45 cursor-default',
        ].join(' ')}
        onClick={handleSubmit}
        disabled={!isSubmitEnabled}
        aria-disabled={!isSubmitEnabled}
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-[18px] h-[18px] rounded-full border-2 border-white/30 border-t-white animate-spin flex-shrink-0" />
            제출 중...
          </span>
        ) : (
          '의견 보내기'
        )}
      </button>
    </>
  );
}

import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

type Provider = 'google' | 'apple';

// 필수 항목 ID
const REQUIRED_IDS = ['c1', 'c2', 'c3', 'c4'] as const;
type TermId = 'c1' | 'c2' | 'c3' | 'c4' | 'c5';
type TermsState = Record<TermId, boolean>;

const INITIAL_STATE: TermsState = { c1: false, c2: false, c3: false, c4: false, c5: false };

interface TermsConsentModalProps {
  isOpen: boolean;
  provider: Provider | null;
  onClose: () => void;
  onAgreeContinue: () => void;
}

function TermCheckbox({ checked }: { checked: boolean }) {
  return (
    <div
      className={`w-5 h-5 rounded-[6px] border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
        checked ? 'bg-navy border-navy' : 'bg-surface border-line'
      }`}
    >
      <svg
        width="11"
        height="11"
        viewBox="0 0 11 11"
        fill="none"
        aria-hidden="true"
        style={{ opacity: checked ? 1 : 0, transition: 'opacity 0.15s' }}
      >
        <path
          d="M1.5 5.5L4.5 8.5L9.5 2.5"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function TermsConsentModal({
  isOpen,
  provider,
  onClose,
  onAgreeContinue,
}: TermsConsentModalProps) {
  const navigate = useNavigate();
  const [terms, setTerms] = useState<TermsState>(INITIAL_STATE);

  const handleClose = useCallback(() => {
    setTerms(INITIAL_STATE);
    onClose();
  }, [onClose]);

  const handleAgreeContinue = useCallback(() => {
    setTerms(INITIAL_STATE);
    onAgreeContinue();
  }, [onAgreeContinue]);

  // ESC 키 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, handleClose]);

  const allRequired = REQUIRED_IDS.every((id) => terms[id]);
  const allChecked = allRequired && terms.c5;

  function toggleAll() {
    const next = !allChecked;
    setTerms({ c1: next, c2: next, c3: next, c4: next, c5: next });
  }

  function toggleItem(id: TermId) {
    setTerms((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const providerLabel = provider === 'google' ? 'Google' : 'Apple';
  const emailNoteText =
    provider === 'google'
      ? 'Google 계정의 이메일 주소를 수집하여 계정 식별 및 서비스 알림 발송에 사용합니다. 수집된 이메일은 제3자에게 제공되지 않습니다.'
      : 'Apple 계정의 이메일 주소를 수집하여 계정 식별 및 서비스 알림 발송에 사용합니다. 수집된 이메일은 제3자에게 제공되지 않습니다.';

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="w-[calc(100%-32px)] max-w-[360px] bg-surface rounded-[20px] overflow-hidden flex flex-col"
        style={{ maxHeight: '90dvh' }}
        role="dialog"
        aria-modal="true"
        aria-label="서비스 이용 동의"
      >
        {/* Header */}
        <div className="px-[22px] pt-6 pb-3 border-b border-line flex-shrink-0">
          <p className="text-[17px] font-bold text-fg mb-[6px]">서비스 이용 동의</p>
          <p className="text-[13px] text-fg-muted leading-[1.45]">
            {providerLabel} 계정으로 계속하려면
            <br />
            아래 항목에 동의해 주세요.
          </p>
        </div>

        {/* Body — 스크롤 가능 */}
        <div className="px-[22px] py-4 flex flex-col gap-0 overflow-y-auto flex-1">
          {/* 전체 동의 */}
          <button
            type="button"
            className="flex items-center gap-3 py-2 w-full"
            onClick={toggleAll}
          >
            <TermCheckbox checked={allChecked} />
            <span className="text-[14px] font-bold text-fg">전체 동의</span>
          </button>

          {/* 구분선 */}
          <div className="h-px bg-line my-1" />

          {/* 이용약관 */}
          <div className="flex items-center gap-3 py-[10px]">
            <button type="button" className="flex items-center gap-3 flex-1 min-w-0" onClick={() => toggleItem('c1')}>
              <TermCheckbox checked={terms.c1} />
              <span className="text-[14px] text-fg flex items-center gap-[6px] min-w-0">
                <Badge type="required" />
                이용약관 동의
              </span>
            </button>
            <button
              type="button"
              className="text-fg-muted flex-shrink-0 p-1 -mr-1"
              onClick={() => navigate('/terms')}
              aria-label="이용약관 보기"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* 개인정보처리방침 */}
          <div className="flex items-center gap-3 py-[10px]">
            <button type="button" className="flex items-center gap-3 flex-1 min-w-0" onClick={() => toggleItem('c2')}>
              <TermCheckbox checked={terms.c2} />
              <span className="text-[14px] text-fg flex items-center gap-[6px] min-w-0">
                <Badge type="required" />
                개인정보처리방침 동의
              </span>
            </button>
            <button
              type="button"
              className="text-fg-muted flex-shrink-0 p-1 -mr-1"
              onClick={() => navigate('/privacy')}
              aria-label="개인정보처리방침 보기"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* 만 14세 이상 */}
          <button
            type="button"
            className="flex items-center gap-3 py-[10px] w-full"
            onClick={() => toggleItem('c3')}
          >
            <TermCheckbox checked={terms.c3} />
            <span className="text-[14px] text-fg flex items-center gap-[6px]">
              <Badge type="required" />
              만 14세 이상입니다
            </span>
          </button>

          {/* 이메일 정보 제공 동의 */}
          <button
            type="button"
            className="flex items-center gap-3 py-[10px] w-full"
            onClick={() => toggleItem('c4')}
          >
            <TermCheckbox checked={terms.c4} />
            <span className="text-[14px] text-fg flex items-center gap-[6px]">
              <Badge type="required" />
              이메일 정보 제공 동의
            </span>
          </button>

          {/* 이메일 안내 박스 */}
          <div className="bg-surface-sub rounded-lg px-3 py-[10px] mb-1">
            <p className="text-[12px] text-fg-muted leading-[1.5]">{emailNoteText}</p>
          </div>

          {/* 마케팅 알림 수신 동의 (선택) */}
          <button
            type="button"
            className="flex items-center gap-3 py-[10px] w-full"
            onClick={() => toggleItem('c5')}
          >
            <TermCheckbox checked={terms.c5} />
            <span className="text-[14px] text-fg flex items-center gap-[6px]">
              <Badge type="optional" />
              마케팅 알림 수신 동의
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="px-[22px] pb-5 pt-3 border-t border-line flex-shrink-0">
          <button
            type="button"
            disabled={!allRequired}
            onClick={handleAgreeContinue}
            className={`w-full h-12 rounded-xl text-[15px] font-semibold transition-all ${
              allRequired
                ? 'bg-navy text-white active:opacity-80'
                : 'bg-surface-sub text-fg-muted cursor-not-allowed'
            }`}
          >
            동의하고 계속하기
          </button>
        </div>
      </div>
    </div>
  );
}

function Badge({ type }: { type: 'required' | 'optional' }) {
  return (
    <span
      className={`text-[10px] font-bold px-[7px] py-[2px] rounded-full flex-shrink-0 ${
        type === 'required'
          ? 'bg-[#EEF1FF] text-navy'
          : 'bg-surface-sub text-fg-muted'
      }`}
    >
      {type === 'required' ? '필수' : '선택'}
    </span>
  );
}

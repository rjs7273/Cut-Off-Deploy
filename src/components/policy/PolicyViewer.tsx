/* ─────────────────────────────────────────────────────────────────
   CMP-POLICY-002 · PolicyViewer
   정책 문서 본문 렌더러.
   이용약관 / 개인정보처리방침 공통 레이아웃.

   초안 HTML 참조:
     .terms-section  / .terms-title / .terms-body
     문의 박스: margin-top 28px, bg-sub, radius-md, 12px text-2
   ───────────────────────────────────────────────────────────────── */
import type { PolicyDocument } from '@/types/policy';

interface Props {
  doc: PolicyDocument;
}

export default function PolicyViewer({ doc }: Props) {
  return (
    /* 스크롤 가능한 본문 영역 */
    <div className="flex-1 overflow-y-auto px-[20px] pt-[24px] pb-[48px]">
      {/* 문서 제목 */}
      <h1 className="text-[18px] font-bold text-fg tracking-[-0.4px] mb-[4px]">
        {doc.title}
      </h1>

      {/* 시행일 */}
      <p className="text-[12px] text-fg-subtle mb-[24px]">
        시행일: {doc.effectiveDate}
      </p>

      {/* 섹션 목록 */}
      {doc.sections.map((section, idx) => (
        <div key={idx} className="mb-[20px]">
          <p className="text-[14px] font-bold text-fg mb-[6px]">
            {section.title}
          </p>
          <p className="text-[13px] text-fg-muted leading-[1.75]">
            {section.body}
          </p>
        </div>
      ))}

      {/* 문의 정보 박스 */}
      <div className="mt-[28px] px-[16px] py-[14px] bg-surface-sub rounded-[12px]">
        <p className="text-[12px] text-fg-muted leading-[1.7]">
          {doc.contact.contactLabel}:{' '}
          <span className="text-navy">{doc.contact.email}</span>
          <br />
          운영사: {doc.contact.operator}
          <br />
          시행일: {doc.contact.effectiveDate}
        </p>
      </div>
    </div>
  );
}

import PageContainer from '@/components/layout/PageContainer';
import AppHeader from '@/components/layout/AppHeader';
import PolicyViewer from '@/components/policy/PolicyViewer';
import { POLICY_DOCUMENTS } from '@/data/policyDocuments';
import type { PolicyType } from '@/types/policy';

/* ─────────────────────────────────────────────────────────────────
   PolicyPage  (CMP-POLICY-001)
   ─────────────────────────────────────────────────────────────────
   이용약관 / 개인정보처리방침 화면.
   policyType prop으로 어떤 문서를 표시할지 결정한다.

   진입 경로:
     /terms   → policyType="terms"
     /privacy → policyType="privacy"

   TODO: MVP 이후 서버 API 또는 원격 CMS에서 문서를 조회하도록 교체
   ───────────────────────────────────────────────────────────────── */

interface Props {
  policyType: PolicyType;
}

export default function PolicyPage({ policyType }: Props) {
  const doc = POLICY_DOCUMENTS[policyType];

  const HEADER_TITLE: Record<PolicyType, string> = {
    terms: '이용약관',
    privacy: '개인정보처리방침',
  };

  return (
    <PageContainer scrollable={false}>
      <AppHeader variant="default" title={HEADER_TITLE[policyType]} showBack />
      <PolicyViewer doc={doc} />
    </PageContainer>
  );
}

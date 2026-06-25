/* ─────────────────────────────────────────────────────────────────
   CMP-MY-008 · SupportMenuSection
   "지원" 섹션 — 의견 보내기 / 이용약관 / 개인정보처리방침 / 앱 버전.
   항상 표시 (비회원 포함).
   ───────────────────────────────────────────────────────────────── */
import { SettingSection, SettingRow } from './_shared';

interface Props {
  appVersion?: string;
  onClickFeedback: () => void;
  onClickTerms: () => void;
  onClickPrivacy: () => void;
}

export default function SupportMenuSection({
  appVersion = '1.0.0',
  onClickFeedback,
  onClickTerms,
  onClickPrivacy,
}: Props) {
  return (
    <SettingSection label="지원">
      <SettingRow label="의견 보내기" showArrow onClick={onClickFeedback} />
      <SettingRow label="이용약관" showArrow onClick={onClickTerms} />
      <SettingRow label="개인정보처리방침" showArrow onClick={onClickPrivacy} />
      <SettingRow
        label="앱 버전"
        labelStyle="text-fg-muted text-[13px]"
        right={<span className="text-[13px] text-fg-muted">{appVersion}</span>}
      />
    </SettingSection>
  );
}

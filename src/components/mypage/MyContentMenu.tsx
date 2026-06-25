/* ─────────────────────────────────────────────────────────────────
   CMP-MY-004 · MyContentMenu
   "내 콘텐츠" 섹션 — 저장한 영상 / 최근 시청 기록 진입.
   로그인 사용자에게만 표시.
   ───────────────────────────────────────────────────────────────── */
import { SettingSection, SettingRow } from './_shared';

interface Props {
  savedCount?: number;
  onClickSaved: () => void;
  onClickHistory: () => void;
}

export default function MyContentMenu({ savedCount, onClickSaved, onClickHistory }: Props) {
  return (
    <SettingSection label="내 콘텐츠">
      <SettingRow
        label="저장한 영상"
        right={savedCount !== undefined ? <span>{savedCount}개</span> : undefined}
        showArrow
        onClick={onClickSaved}
      />
      <SettingRow
        label="최근 시청 기록"
        showArrow
        onClick={onClickHistory}
      />
    </SettingSection>
  );
}

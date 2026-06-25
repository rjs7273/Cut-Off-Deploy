/* ─────────────────────────────────────────────────────────────────
   CMP-MY-005 · PersonalSettingsSection
   "개인 설정" + "앱 설정" 두 섹션을 하나의 컴포넌트로 관리.

   개인 설정:
     - 관심사 설정 → navigate to /category (edit mode)
     - 오늘의 추천 알림 → toggle

   앱 설정 (CMP-MY-006 · ThemeSegment 포함):
     - 테마 밝게/어둡게

   초안 HTML 참조:
     .toggle w-44px h-26px rounded-[13px]
     .toggle-dot w-20px h-20px rounded-full, top-3 right-3 / left-3
     .theme-seg bg-surface-sub rounded-[8px] p-[2px] gap-[2px]
     .theme-seg-btn px-[14px] py-[4px] rounded-[6px] 13px 500
     .theme-seg-btn.active bg-surface 600 shadow
   ───────────────────────────────────────────────────────────────── */
import { SettingSection, SettingRow } from './_shared';
import { useThemeStore } from '@/store/themeStore';

interface Props {
  /** 관심사 요약 텍스트 ex) "브랜딩, 마케팅 외" */
  interestSummary: string;
  notifAgree: boolean;
  onClickInterest: () => void;
  onToggleNotification: () => void;
}

/* ─── Toggle ──────────────────────────────────────────────────── */
function Toggle({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={isOn}
      className={[
        'relative w-[44px] h-[26px] rounded-[13px] cursor-pointer flex-shrink-0',
        'transition-colors duration-200 border-none',
        isOn ? 'bg-navy' : 'bg-line',
      ].join(' ')}
      onClick={onToggle}
    >
      <span
        className={[
          'absolute top-[3px] w-[20px] h-[20px] bg-white rounded-full',
          'transition-all duration-200',
          isOn ? 'right-[3px]' : 'left-[3px]',
        ].join(' ')}
      />
    </button>
  );
}

/* ─── ThemeSegment (CMP-MY-006) ───────────────────────────────── */
function ThemeSegment() {
  const { theme, setTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className="flex bg-surface-sub rounded-[8px] p-[2px] gap-[2px]">
      <button
        className={[
          'px-[14px] py-[4px] rounded-[6px] text-[13px] border-none transition-all duration-150 font-sans',
          !isDark
            ? 'bg-surface-card text-fg font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.10)]'
            : 'bg-transparent text-fg-subtle font-medium',
        ].join(' ')}
        onClick={() => setTheme('light')}
      >
        밝게
      </button>
      <button
        className={[
          'px-[14px] py-[4px] rounded-[6px] text-[13px] border-none transition-all duration-150 font-sans',
          isDark
            ? 'bg-surface-card text-fg font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.10)]'
            : 'bg-transparent text-fg-subtle font-medium',
        ].join(' ')}
        onClick={() => setTheme('dark')}
      >
        어둡게
      </button>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────── */
export default function PersonalSettingsSection({
  interestSummary,
  notifAgree,
  onClickInterest,
  onToggleNotification,
}: Props) {
  return (
    <>
      {/* 개인 설정 */}
      <SettingSection label="개인 설정">
        <SettingRow
          label="관심사 설정"
          right={<span className="text-[13px] text-fg-muted">{interestSummary}</span>}
          showArrow
          onClick={onClickInterest}
        />
        <SettingRow
          label="오늘의 추천 알림"
          right={<Toggle isOn={notifAgree} onToggle={onToggleNotification} />}
        />
      </SettingSection>

      {/* 앱 설정 */}
      <SettingSection label="앱 설정">
        <SettingRow label="테마" right={<ThemeSegment />} />
      </SettingSection>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   CMP-MY-007 · SubscriptionSection
   구독 상태 표시.

   userTier
   - 'free'       → "구독 시작하기" + 미구독 뱃지
   - 'subscribed' → "Cut-off 구독" + 구독 중 뱃지 + since 날짜

   초안 HTML 참조:
     .mp-sub-badge.active  : bg #E8F5E9, color #2E7D32
     .mp-sub-badge.inactive: bg tag-bg,  color tag-fg
   ───────────────────────────────────────────────────────────────── */
import { SettingSection, SettingRow } from './_shared';

type UserTier = 'free' | 'subscribed';

interface Props {
  userTier: UserTier;
  /** 구독 시작일 ex) "2025년 3월부터" */
  subscribedSince?: string;
  onClickSubscribe: () => void;
  onClickUnsubscribe: () => void;
}

function SubBadge({ active }: { active: boolean }) {
  return (
    <span
      className={[
        'text-[10px] font-semibold px-[7px] py-[2px] rounded-full tracking-[0.2px] flex-shrink-0',
        active
          ? 'bg-[#E8F5E9] text-[#2E7D32]'
          : 'bg-tag text-tag-fg',
      ].join(' ')}
    >
      {active ? '구독 중' : '미구독'}
    </span>
  );
}

export default function SubscriptionSection({
  userTier,
  subscribedSince,
  onClickSubscribe,
  onClickUnsubscribe,
}: Props) {
  const isSubscribed = userTier === 'subscribed';

  return (
    <SettingSection label="구독">
      {isSubscribed ? (
        <SettingRow
          label="Cut-off 구독"
          right={
            <>
              <SubBadge active />
              {subscribedSince && (
                <span className="text-[13px] text-fg-subtle">{subscribedSince}</span>
              )}
            </>
          }
          showArrow
          onClick={onClickUnsubscribe}
        />
      ) : (
        <SettingRow
          label="구독 시작하기"
          right={<SubBadge active={false} />}
          showArrow
          onClick={onClickSubscribe}
        />
      )}
    </SettingSection>
  );
}

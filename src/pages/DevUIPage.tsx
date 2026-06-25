import { useState } from 'react';
import {
  Bookmark, Star, Plus, Trash2, Send,
  ChevronRight, AlertCircle, Inbox,
} from 'lucide-react';

import PageContainer from '@/components/layout/PageContainer';
import AppHeader from '@/components/layout/AppHeader';
import {
  Button,
  IconButton,
  Chip,
  Tabs,
  BottomSheet,
  Modal,
  LoadingSkeleton,
  EmptyState,
} from '@/components/ui';
import type { TabItem } from '@/components/ui';
import { useOverlayStore } from '@/store/overlayStore';

/* ════════════════════════════════════════════════════════════════
   DevUIPage — Common UI 컴포넌트 쇼케이스
   /dev-ui 라우트에서 접근 (개발 전용)
   ════════════════════════════════════════════════════════════════ */

/* ── 섹션 래퍼 ── */
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-6 border-b border-line last:border-b-0">
      <h2 className="text-[11px] font-bold text-navy uppercase tracking-[0.8px] px-5 mb-4">
        {title}
      </h2>
      <div className="px-5">{children}</div>
    </section>
  );
}

/* ── 소제목 ── */
function Sub({ label }: { label: string }) {
  return <p className="text-[12px] text-fg-subtle mb-2 mt-4 first:mt-0">{label}</p>;
}

/* ── 행 래퍼 ── */
function Row({ children, wrap = false }: { children: React.ReactNode; wrap?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${wrap ? 'flex-wrap' : ''}`}>
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════ */

export default function DevUIPage() {
  const { showToast } = useOverlayStore();

  /* ── Chip 상태 ── */
  const INTERESTS = ['자기계발', '비즈니스', 'IT/테크', '사이언스', '아트', '건강'];
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['자기계발']);
  const FILTERS = ['전체', '습관형성', '생산성', '마인드셋'];
  const [selectedFilter, setSelectedFilter] = useState('전체');

  /* ── Tabs 상태 ── */
  const TABS: TabItem[] = [
    { id: 'all', label: '전체', count: 12 },
    { id: 'folder1', label: '기본 폴더', count: 5 },
    { id: 'folder2', label: '나중에 볼게요', count: 7 },
  ];
  const [selectedTab, setSelectedTab] = useState('all');

  /* ── BottomSheet 상태 ── */
  const [sheetDefault, setSheetDefault] = useState(false);
  const [sheetFull, setSheetFull] = useState(false);

  /* ── Modal 상태 ── */
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalAlert, setModalAlert] = useState(false);

  /* ── IconButton 저장 상태 ── */
  const [saved1, setSaved1] = useState(false);
  const [saved2, setSaved2] = useState(false);
  const [saved3, setSaved3] = useState(false);

  /* ── LoadingSkeleton 표시 여부 ── */
  const [showSkel, setShowSkel] = useState(true);

  return (
    <PageContainer scrollable>
      {/* ── 헤더 ── */}
      <AppHeader variant="home" showMenu showMyPage />

      {/* ── 페이지 타이틀 ── */}
      <div className="px-5 pt-5 pb-3 border-b border-line">
        <p className="text-[20px] font-bold text-fg tracking-[-0.4px]">UI 컴포넌트</p>
        <p className="text-[13px] text-fg-muted mt-1">Common UI — 개발 확인용 페이지</p>
      </div>

      {/* ── 섹션 점프 내비게이션 ── */}
      <div className="flex gap-2 overflow-x-auto px-5 py-3 border-b border-line">
        {[
          ['btn', 'Button'],
          ['icon', 'IconButton'],
          ['chip', 'Chip'],
          ['tab', 'Tabs'],
          ['sheet', 'BottomSheet'],
          ['modal', 'Modal'],
          ['skel', 'Skeleton'],
          ['empty', 'EmptyState'],
          ['header', 'AppHeader'],
        ].map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className="
              flex-shrink-0 px-3 py-1.5 rounded-[20px]
              border border-line text-[11px] text-fg-muted
              hover:border-navy hover:text-navy
              transition-colors duration-150
            "
          >
            {label}
          </a>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════
          1. BUTTON
         ══════════════════════════════════════════════════ */}
      <Section id="btn" title="Button — CMP-UI-001">
        <Sub label="variant" />
        <div className="flex flex-col gap-3">
          <Button variant="primary"   size="lg" fullWidth>primary  · lg (52px)</Button>
          <Button variant="primary"   size="md" fullWidth>primary  · md (48px)</Button>
          <Button variant="secondary" size="md" fullWidth>secondary · md</Button>
          <Button variant="ghost"     size="sm" fullWidth>ghost · sm (44px)</Button>
          <Button variant="outline"   size="sm" fullWidth>outline · sm</Button>
        </div>

        <Sub label="icon 슬롯" />
        <div className="flex flex-col gap-3">
          <Button variant="primary" size="md" fullWidth leftIcon={<Send size={15} />}>
            YouTube에서 보기
          </Button>
          <Button variant="outline" size="sm" fullWidth leftIcon={<Plus size={14} />}>
            폴더 만들기
          </Button>
        </div>

        <Sub label="상태" />
        <div className="flex flex-col gap-3">
          <Button variant="primary" size="md" fullWidth loading>저장 중…</Button>
          <Button variant="primary" size="md" fullWidth disabled>비활성 (disabled)</Button>
        </div>

        <Sub label="width=auto" />
        <Row>
          <Button variant="primary"   size="sm">확인</Button>
          <Button variant="secondary" size="sm">취소</Button>
          <Button variant="ghost"     size="xs">건너뛰기</Button>
        </Row>
      </Section>

      {/* ══════════════════════════════════════════════════
          2. ICON BUTTON
         ══════════════════════════════════════════════════ */}
      <Section id="icon" title="IconButton — CMP-UI-002">
        <Sub label="save preset (floating — 카드 위 반투명)" />
        <Row>
          <div className="relative w-[120px] h-[70px] rounded-app-md bg-skel overflow-hidden flex items-center justify-center">
            <span className="text-[10px] text-fg-subtle">썸네일 영역</span>
            <IconButton
              preset="save" size="md" floating
              saved={saved1} onClick={() => setSaved1(!saved1)}
              className="absolute top-1.5 right-1.5"
              aria-label="저장"
            />
          </div>
          <p className="text-[12px] text-fg-muted">클릭하면 저장 상태 토글</p>
        </Row>

        <Sub label="save preset (bordered — 바텀시트 내 저장 버튼)" />
        <Row>
          <IconButton preset="save" size="md" bordered saved={saved2} onClick={() => setSaved2(!saved2)} aria-label="저장" />
          <IconButton preset="save" size="lg" bordered saved={saved3} onClick={() => setSaved3(!saved3)} aria-label="저장" />
          <p className="text-[12px] text-fg-muted">md / lg</p>
        </Row>

        <Sub label="close / more" />
        <Row>
          <IconButton preset="close" size="md" aria-label="닫기" />
          <IconButton preset="more"  size="md" aria-label="더보기" />
        </Row>

        <Sub label="custom — children 직접 전달" />
        <Row>
          <IconButton preset="custom" size="md" aria-label="북마크">
            <Bookmark size={16} strokeWidth={1.8} className="text-fg-muted" />
          </IconButton>
          <IconButton preset="custom" size="md" aria-label="별점">
            <Star size={16} strokeWidth={1.8} className="text-fg-muted" />
          </IconButton>
          <IconButton preset="custom" size="sm" aria-label="삭제">
            <Trash2 size={14} strokeWidth={1.8} className="text-error" />
          </IconButton>
        </Row>
      </Section>

      {/* ══════════════════════════════════════════════════
          3. CHIP
         ══════════════════════════════════════════════════ */}
      <Section id="chip" title="Chip — CMP-UI-003">
        <Sub label="interest variant (관심사 선택 — 다중 선택)" />
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((item) => (
            <Chip
              key={item}
              label={item}
              variant="interest"
              selected={selectedInterests.includes(item)}
              onClick={() =>
                setSelectedInterests((prev) =>
                  prev.includes(item)
                    ? prev.filter((i) => i !== item)
                    : [...prev, item]
                )
              }
            />
          ))}
        </div>
        <p className="text-[12px] text-fg-subtle mt-2">
          선택: {selectedInterests.join(', ') || '없음'}
        </p>

        <Sub label="filter variant (카테고리 필터 — 단일 선택)" />
        <div className="flex gap-2 overflow-x-auto">
          {FILTERS.map((item) => (
            <Chip
              key={item}
              label={item}
              variant="filter"
              selected={selectedFilter === item}
              onClick={() => setSelectedFilter(item)}
            />
          ))}
        </div>

        <Sub label="disabled" />
        <Row>
          <Chip label="선택 불가" variant="interest" disabled />
          <Chip label="선택됨+disabled" variant="interest" selected disabled />
        </Row>
      </Section>

      {/* ══════════════════════════════════════════════════
          4. TABS
         ══════════════════════════════════════════════════ */}
      <Section id="tab" title="Tabs — CMP-UI-004">
        <div className="-mx-5">
          <Tabs
            tabs={TABS}
            selectedId={selectedTab}
            onSelect={setSelectedTab}
            trailingSlot={
              <Button variant="outline" size="xs" leftIcon={<Plus size={12} />}>
                폴더
              </Button>
            }
          />
        </div>
        <p className="text-[12px] text-fg-subtle mt-3">
          선택된 탭: <strong>{TABS.find((t) => t.id === selectedTab)?.label}</strong>
        </p>
      </Section>

      {/* ══════════════════════════════════════════════════
          5. BOTTOM SHEET
         ══════════════════════════════════════════════════ */}
      <Section id="sheet" title="BottomSheet — CMP-UI-005">
        <Sub label="variant=default (콘텐츠 높이)" />
        <Button variant="outline" size="sm" onClick={() => setSheetDefault(true)}>
          Default Sheet 열기
        </Button>

        <Sub label="variant=full (화면 전체 — 영상 상세)" />
        <Button variant="outline" size="sm" onClick={() => setSheetFull(true)}>
          Full Sheet 열기
        </Button>

        {/* Default Sheet */}
        <BottomSheet
          isOpen={sheetDefault}
          onClose={() => setSheetDefault(false)}
          showHandle
          showClose
          title="액션 선택"
        >
          <div className="px-5 py-4 flex flex-col gap-0">
            {['관심 없는 영상이에요', '이미 본 영상이에요', '이 채널 영상 그만 보기'].map((item) => (
              <button
                key={item}
                className="py-[15px] text-[16px] text-fg text-left border-b border-line last:border-b-0 hover:bg-surface-sub transition-colors"
                onClick={() => { setSheetDefault(false); showToast(`"${item}" 선택됨`); }}
              >
                {item}
              </button>
            ))}
            <button
              className="py-[14px] text-[14px] text-fg-muted text-center"
              onClick={() => setSheetDefault(false)}
            >
              건너뛰기
            </button>
          </div>
        </BottomSheet>

        {/* Full Sheet */}
        <BottomSheet
          isOpen={sheetFull}
          onClose={() => setSheetFull(false)}
          variant="full"
          showClose
          showHandle
        >
          <div className="px-5 pt-2 pb-6">
            {/* 썸네일 */}
            <div className="w-full aspect-video bg-gradient-to-br from-[#C8D4E8] to-[#8FA3C4] rounded-app-md mb-4 flex items-center justify-center">
              <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center text-[18px]">▶</div>
            </div>
            {/* 태그 + 제목 */}
            <div className="flex items-center gap-2 mb-3">
              <span className="tag-navy">오늘의 Pick</span>
              <span className="tag-neutral">자기계발</span>
            </div>
            <p className="text-[17px] font-bold text-fg leading-[1.4] mb-2">
              어떻게 하면 매일 아침 5시에 일어날 수 있을까?
            </p>
            <p className="text-[13px] text-fg-muted mb-4">체인지그라운드 · 14:32</p>
            {/* 에디터 코멘트 */}
            <div className="editor-comment-box mb-4">
              <p className="text-[10px] font-bold text-navy uppercase tracking-[0.5px] mb-1">EDITOR'S PICK</p>
              <p className="text-[13px] text-fg leading-[1.55]">
                기상 루틴을 바꾸고 싶은 분들에게 강력 추천. 작은 습관 하나가 하루 전체를 바꿀 수 있다는 것을 쉽게 설명해줍니다.
              </p>
            </div>
            {/* CTA */}
            <div className="flex flex-col gap-2 pt-3 border-t border-line">
              <Button variant="primary" size="md" fullWidth leftIcon={<ChevronRight size={15} />}>
                YouTube에서 보기
              </Button>
              <Button variant="ghost" size="sm" fullWidth onClick={() => setSheetFull(false)}>
                건너뛰기
              </Button>
            </div>
          </div>
        </BottomSheet>
      </Section>

      {/* ══════════════════════════════════════════════════
          6. MODAL
         ══════════════════════════════════════════════════ */}
      <Section id="modal" title="Modal — CMP-UI-006">
        <Sub label="variant=confirm (되돌리기 확인 모달)" />
        <Button variant="outline" size="sm" onClick={() => setModalConfirm(true)}>
          Confirm Modal 열기
        </Button>

        <Sub label="variant=alert (단순 안내)" />
        <Button variant="outline" size="sm" onClick={() => setModalAlert(true)}>
          Alert Modal 열기
        </Button>

        {/* Confirm Modal */}
        <Modal
          isOpen={modalConfirm}
          onClose={() => setModalConfirm(false)}
          variant="confirm"
          thumbnail={
            <div className="w-full h-full bg-gradient-to-br from-[#C8D4E8] to-[#8FA3C4] flex items-center justify-center">
              <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-[16px]">▶</div>
            </div>
          }
          label="오늘의 pick"
          title="어떻게 하면 매일 아침 5시에…"
          description="이 영상을 복구할까요?"
          cancelLabel="아니요"
          confirmLabel="복구하기"
          onConfirm={() => {
            setModalConfirm(false);
            showToast('영상이 복구됐습니다.');
          }}
        />

        {/* Alert Modal */}
        <Modal
          isOpen={modalAlert}
          onClose={() => setModalAlert(false)}
          variant="alert"
          title="관심사 설정 안내"
          description="관심사는 하루에 한 번만 변경할 수 있어요."
          confirmLabel="확인했어요"
          onConfirm={() => setModalAlert(false)}
        />
      </Section>

      {/* ══════════════════════════════════════════════════
          7. LOADING SKELETON
         ══════════════════════════════════════════════════ */}
      <Section id="skel" title="LoadingSkeleton — CMP-UI-008">
        <Row>
          <Button
            variant={showSkel ? 'primary' : 'outline'}
            size="xs"
            onClick={() => setShowSkel(!showSkel)}
          >
            {showSkel ? '스켈레톤 숨기기' : '스켈레톤 보이기'}
          </Button>
        </Row>

        {showSkel && (
          <>
            <Sub label="type=card (TodayPickCard)" />
            <div className="-mx-5">
              <LoadingSkeleton type="card" />
            </div>

            <Sub label="type=hcard (가로 스크롤 카드 × 3)" />
            <div className="-mx-5">
              <LoadingSkeleton type="hcard" count={3} />
            </div>

            <Sub label="type=list-item (목록 아이템 × 3)" />
            <LoadingSkeleton type="list-item" count={3} />
          </>
        )}
      </Section>

      {/* ══════════════════════════════════════════════════
          8. EMPTY STATE
         ══════════════════════════════════════════════════ */}
      <Section id="empty" title="EmptyState — CMP-UI-009">
        <Sub label="variant=empty (저장한 영상 없음)" />
        <div className="border border-line rounded-app-md overflow-hidden">
          <EmptyState
            variant="empty"
            icon={<Inbox size={28} className="text-fg-muted" />}
            title="저장한 영상이 없어요"
            description="마음에 드는 영상의 하트를 눌러 저장해보세요."
            actionLabel="홈으로 가기"
            onAction={() => showToast('홈으로 이동 (테스트)')}
          />
        </div>

        <Sub label="variant=error (네트워크 오류)" />
        <div className="border border-line rounded-app-md overflow-hidden">
          <EmptyState
            variant="error"
            icon={<AlertCircle size={28} className="text-warning" />}
            title="데이터를 불러올 수 없어요"
            description="네트워크 연결을 확인하고 다시 시도해주세요."
            actionLabel="다시 시도"
            onAction={() => showToast('재시도 (테스트)')}
          />
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════
          9. APP HEADER VARIANTS
         ══════════════════════════════════════════════════ */}
      <Section id="header" title="AppHeader — CMP-APP-003">
        <p className="text-[13px] text-fg-muted leading-[1.6] mb-4">
          실제 헤더는 페이지 최상단에 고정됩니다. 아래는 각 variant의 미리보기입니다.
        </p>

        {[
          { label: 'variant="home"',    node: <AppHeader variant="home"    showNotification showMyPage noBorder /> },
          { label: 'variant="default" showBack', node: <AppHeader variant="default" title="카테고리 목록" showBack noBorder /> },
          { label: 'variant="default" showMenu', node: <AppHeader variant="default" title="마이페이지" showMenu noBorder /> },
        ].map(({ label, node }) => (
          <div key={label} className="mb-4">
            <p className="text-[11px] text-fg-subtle mb-1">{label}</p>
            <div className="border border-line rounded-app-md overflow-hidden bg-surface">
              {node}
            </div>
          </div>
        ))}
      </Section>

      {/* ══════════════════════════════════════════════════
          10. TOAST
         ══════════════════════════════════════════════════ */}
      <Section id="toast" title="Toast — CMP-UI-007 (overlayStore.showToast)">
        <div className="flex flex-wrap gap-2">
          {[
            '저장됐습니다.',
            '저장이 해제됐습니다.',
            '관심사가 저장됐습니다.',
            '삭제됐습니다.',
          ].map((msg) => (
            <Button
              key={msg}
              variant="outline"
              size="xs"
              onClick={() => showToast(msg)}
            >
              {msg}
            </Button>
          ))}
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════
          디자인 토큰 컬러 스와치
         ══════════════════════════════════════════════════ */}
      <Section id="tokens" title="Design Tokens — 색상 스와치">
        {[
          { name: 'surface',       bg: 'bg-surface',       label: '--color-surface' },
          { name: 'surface-sub',   bg: 'bg-surface-sub',   label: '--color-surface-sub' },
          { name: 'surface-card',  bg: 'bg-surface-card',  label: '--color-surface-card' },
          { name: 'navy',          bg: 'bg-navy',          label: '--color-navy' },
          { name: 'navy-light',    bg: 'bg-navy-light',    label: '--color-navy-light' },
          { name: 'navy-tint',     bg: 'bg-navy-tint',     label: '--color-navy-tint' },
          { name: 'accent',        bg: 'bg-accent',        label: '--color-accent' },
          { name: 'skel',          bg: 'bg-skel',          label: '--color-skel' },
          { name: 'skel2',         bg: 'bg-skel2',         label: '--color-skel2' },
          { name: 'tag',           bg: 'bg-tag',           label: '--color-tag' },
          { name: 'success-bg',    bg: 'bg-success-bg',    label: '--color-success-bg' },
          { name: 'warning-bg',    bg: 'bg-warning-bg',    label: '--color-warning-bg' },
        ].map(({ name, bg, label }) => (
          <div key={name} className="flex items-center gap-3 py-1.5">
            <div className={`w-10 h-10 rounded-app-sm border border-line flex-shrink-0 ${bg}`} />
            <div>
              <p className="text-[13px] font-medium text-fg">{name}</p>
              <p className="text-[11px] text-fg-subtle">{label}</p>
            </div>
          </div>
        ))}
      </Section>

      <div className="h-10" />
    </PageContainer>
  );
}

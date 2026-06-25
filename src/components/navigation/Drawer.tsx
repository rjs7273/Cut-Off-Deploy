/* ─────────────────────────────────────────────────────────────────
   Drawer  (CMP-NAV-001)
   ─────────────────────────────────────────────────────────────────
   좌측 사이드 드로어 (슬라이드 인/아웃).
   UI_0622_초안.html 기반 구조 및 스타일.

   메뉴 구성:
     홈
     [구분선]
     카테고리 (섹션 라벨)
       비즈니스  ›  → 브랜딩 / 경영 전략 / 마케팅 / 커머스
       성장      ›  → 리더십 / 생산성 / 자기계발
       문화·라이프 › → 인문 / 디자인 / 웰니스
       트렌드    ›  → 트렌드 / 콘텐츠
     [구분선]
     관심사 설정
     마이페이지 / 설정

   초안 HTML 참조:
     .drawer / .drawer-profile / .dp-avatar / .dp-name / .dp-sub
     .drawer-menu / .dm-item / .dm-item.active / .dm-arrow
     .dm-sub-item / .dm-divider / .dm-section-label
   ───────────────────────────────────────────────────────────────── */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import type { DrawerProps } from '@/types/layout';

/* ── 카테고리 데이터 (UI_0622_초안.html + catlistData.ts 기반) ── */
interface DrawerCat {
  id: string;
  label: string;
  subs: string[];
}

const DRAWER_CATEGORIES: DrawerCat[] = [
  { id: 'biz',   label: '비즈니스',   subs: ['브랜딩', '경영 전략', '마케팅', '커머스'] },
  { id: 'grow',  label: '성장',       subs: ['리더십', '생산성', '자기계발'] },
  { id: 'cult',  label: '문화·라이프', subs: ['인문', '디자인', '웰니스'] },
  { id: 'trend', label: '트렌드',     subs: ['트렌드', '콘텐츠'] },
];

export default function Drawer({ isOpen, onClose, activePath = '' }: DrawerProps) {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const userInfo   = useAuthStore((s) => s.userInfo);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleNavigate(path: string) {
    navigate(path);
    onClose();
  }

  /* 대분류 클릭 → 해당 그룹 목록 페이지 이동 */
  function goToCatGroup(group: string) {
    navigate(`/catlist?group=${encodeURIComponent(group)}`);
    onClose();
  }

  /* 소분류 클릭 → 해당 그룹 + 필터 선택 상태로 이동 */
  function goToCatList(group: string, filter: string) {
    navigate(`/catlist?group=${encodeURIComponent(group)}&filter=${encodeURIComponent(filter)}`);
    onClose();
  }

  function toggleCat(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <>
      {/* ── 딤 오버레이 ── */}
      <div
        className={[
          'absolute inset-0 z-[20] transition-opacity duration-250',
          isOpen ? 'bg-black/40 pointer-events-auto' : 'bg-transparent pointer-events-none',
        ].join(' ')}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── 드로어 패널 ── */}
      <aside
        className={[
          'absolute top-0 left-0 bottom-0 z-[21]',
          'w-[280px] flex flex-col bg-surface',
          'transition-transform duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        aria-label="사이드 메뉴"
      >
        {/* ── .drawer-profile — pt:52px px:20px pb:20px border-b ── */}
        <div className="pt-[52px] px-5 pb-5 border-b border-line">
          {isLoggedIn && userInfo ? (
            <>
              {/* .dp-avatar — 로그인: 이니셜 + gradient */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-2 text-white text-[15px] font-bold select-none"
                style={{ background: 'linear-gradient(135deg, #1D2B53, #2A3D70)' }}
                aria-label={`${userInfo.nickname} 프로필`}
              >
                {userInfo.nickname.charAt(0)}
              </div>
              <p className="text-[15px] font-bold text-fg">{userInfo.nickname}</p>
              <p className="text-[12px] text-fg-muted truncate">{userInfo.email}</p>
            </>
          ) : (
            <>
              {/* .dp-avatar — 비회원: 기본 아이콘 */}
              <div className="w-10 h-10 rounded-full bg-surface-sub border border-line flex items-center justify-center mb-2 text-fg-muted">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="8.2" r="3.4" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M5.5 18.5c.8-2.8 3.4-4.5 6.5-4.5s5.7 1.7 6.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-[15px] font-bold text-fg">비회원</p>
              <p className="text-[12px] text-fg-muted">로그인하면 더 많은 기능을 사용할 수 있습니다.</p>
            </>
          )}
        </div>

        {/* ── .drawer-menu — flex-1, overflow-y-auto, py:12px ── */}
        <nav className="flex-1 overflow-y-auto py-3 scrollbar-hide">

          {/* 홈 */}
          <DmItem
            label="홈"
            isActive={activePath === '/home'}
            onClick={() => handleNavigate('/home')}
          />

          {/* 구분선 */}
          <div className="h-px bg-line my-2" />

          {/* 카테고리 섹션 라벨 */}
          {/* .dm-section-label — 11px/600/text-subtle/uppercase/tracking-0.5px */}
          <p className="px-5 py-[6px] pb-[2px] text-[11px] font-semibold text-fg-subtle uppercase tracking-[0.5px]">
            카테고리
          </p>

          {/* 대분류 + 소분류 */}
          {DRAWER_CATEGORIES.map((cat) => {
            const isExpanded = expandedId === cat.id;
            const isActive = activePath.includes('/catlist') && activePath.includes(cat.label);
            return (
              <div key={cat.id}>
                {/* .dm-item — 대분류 행 */}
                <div
                  role="button"
                  tabIndex={0}
                  className={[
                    'flex items-center justify-between px-5 py-[11px]',
                    'text-[15px] cursor-pointer select-none',
                    'hover:bg-surface-sub transition-colors duration-150',
                    isActive ? 'text-navy font-bold' : 'text-fg',
                  ].join(' ')}
                  onClick={() => toggleCat(cat.id)}
                  onKeyDown={(e) => e.key === 'Enter' && toggleCat(cat.id)}
                >
                  <span
                    role="button"
                    tabIndex={-1}
                    onClick={(e) => { e.stopPropagation(); goToCatGroup(cat.label); }}
                    onKeyDown={(e) => e.key === 'Enter' && goToCatGroup(cat.label)}
                  >
                    {cat.label}
                  </span>
                  {/* .dm-arrow — 11px/text-3, 펼침 시 회전 */}
                  <span
                    className="text-[11px] text-fg-subtle inline-block transition-transform duration-150"
                    style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                    aria-hidden="true"
                  >
                    ›
                  </span>
                </div>

                {/* .dm-sub-item 목록 — 펼침 시 표시 */}
                {isExpanded && cat.subs.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    className="w-full text-left px-5 py-[9px] pl-9 text-[13px] text-fg-muted hover:bg-surface-sub hover:text-fg transition-colors duration-150 block"
                    onClick={() => goToCatList(cat.label, sub)}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            );
          })}

          {/* 구분선 */}
          <div className="h-px bg-line my-2" />

          {/* 하단 설정 메뉴 */}
          <DmItem
            label="관심사 설정"
            onClick={() => handleNavigate('/category-edit')}
          />
          <DmItem
            label="마이페이지 / 설정"
            isActive={activePath === '/mypage'}
            onClick={() => handleNavigate('/mypage')}
          />
        </nav>
      </aside>
    </>
  );
}

/* ── .dm-item 컴포넌트 ── */
interface DmItemProps {
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

function DmItem({ label, isActive = false, onClick }: DmItemProps) {
  return (
    <button
      type="button"
      className={[
        'w-full flex items-center justify-between px-5 py-[11px]',
        'text-[15px] text-left cursor-pointer',
        'hover:bg-surface-sub transition-colors duration-150',
        isActive ? 'text-navy font-bold' : 'text-fg',
      ].join(' ')}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────
   OnboardPage
   ─────────────────────────────────────────────────────────────────
   온보딩 3-슬라이드 화면. URL: /onboard
   온보딩 플로우 (AppLayout 미사용)

   슬라이드 구성:
     1. "좋은 영상을 찾느라 지치셨나요?" — 저품질 콘텐츠 필터링
     2. "오늘의 대표 추천과 다른 추천을 함께 제공합니다." — 카드 UI 프리뷰
     3. "아직 알려지지 않은 좋은 채널도 발견합니다." — 채널 발견 카드

   초안 HTML 참조:
     #screen-onboard1 / .ob-slide / .ob-dots / .od / .od.on
     .onboard-visual / .onboard-title / .onboard-body
     .mock-cards-blur / .mock-card-bg / .mock-card-center
   ───────────────────────────────────────────────────────────────── */
import { useState, useCallback } from 'react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';

/* ── 진행 도트 ── */
function Dots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-[6px] justify-center mb-10">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={[
            'h-2 rounded-full transition-all duration-300',
            i === current
              ? 'w-5 bg-navy rounded-[4px]'
              : 'w-2 bg-line',
          ].join(' ')}
        />
      ))}
    </div>
  );
}

/* ── 슬라이드 1 비주얼: 저품질 카드 필터링 ── */
function Slide1Visual() {
  return (
    /* .mock-cards-blur — position relative, 280×200 */
    <div className="relative w-[280px] h-[200px]">
      {/* 뒤 카드들 */}
      <div className="absolute w-[100px] h-[70px] top-5 left-[10px] bg-line opacity-40 rounded-app-md rotate-[-6deg]" />
      <div className="absolute w-[90px] h-[65px] top-[30px] right-[10px] bg-line opacity-40 rounded-app-md rotate-[5deg]" />
      {/* 중앙 카드 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[110px] bg-surface rounded-app-md border border-line overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
        <div className="w-full h-[65px] bg-skel" />
        <div className="h-2 bg-skel2 mx-[10px] mt-2 mb-1 rounded-[4px]" />
        <div className="h-[6px] bg-skel mx-[10px] rounded-[4px] w-[60%]" />
      </div>
      {/* 빨간 X 표시들 */}
      <div className="absolute top-[22px] left-[15px] text-[20px] text-[#CC3333] font-bold">✕</div>
      <div className="absolute top-[30px] right-[14px] text-[20px] text-[#CC3333] font-bold">✕</div>
    </div>
  );
}

/* ── 슬라이드 2 비주얼: Today's Pick 카드 프리뷰 ── */
function Slide2Visual() {
  return (
    <div className="w-[240px] border border-line rounded-[16px] overflow-hidden bg-surface shadow-[0_4px_20px_rgba(0,0,0,0.07)]">
      {/* 레이블 */}
      <div className="px-3 pt-[10px] pb-[6px] flex gap-[6px]">
        <span className="text-[10px] font-bold text-navy bg-[#EEF1FF] px-2 py-[2px] rounded-[20px]">Today's Pick</span>
        <span className="text-[10px] text-fg-muted bg-tag px-2 py-[2px] rounded-[20px]">브랜딩</span>
      </div>
      {/* 썸네일 */}
      <div className="w-full h-[100px] flex items-center justify-center relative" style={{ background: 'linear-gradient(135deg,#C8D4E8,#8FA3C4)' }}>
        <div className="w-8 h-8 bg-white/85 rounded-full flex items-center justify-center text-[12px]">▶</div>
        <span className="absolute bottom-[5px] right-2 bg-black/70 text-white text-[9px] px-[5px] py-px rounded-[3px]">18:42</span>
      </div>
      {/* 정보 — padding: 10px 12px 12px (HTML .cat-wrap 기준) */}
      <div className="px-3 pt-[10px] pb-3">
        <p className="text-[12px] font-bold text-fg leading-[1.4] mb-[3px]">브랜드는 왜 조용한 마케팅을 말하기 시작했나</p>
        <p className="text-[10px] text-fg-muted mb-2">○○○ Studio</p>
        <div className="bg-surface-sub rounded-[6px] px-[9px] py-[7px] mb-[10px]">
          <p className="text-[9px] font-bold text-navy tracking-[0.5px] mb-[3px]">EDITOR'S COMMENT</p>
          <p className="text-[10px] text-fg leading-[1.5]">브랜드 전략 관점에서 변화의 이유를 설명합니다.</p>
        </div>
        <div className="w-full h-[30px] bg-navy rounded-[6px] flex items-center justify-center text-[11px] text-white font-semibold">유튜브로 보기</div>
      </div>
    </div>
  );
}

/* ── 슬라이드 3 비주얼: 채널 발견 카드 ── */
function Slide3Visual() {
  return (
    <div className="w-[240px]">
      <div className="border border-line rounded-[14px] px-[14px] py-[14px] bg-surface shadow-[0_4px_20px_rgba(0,0,0,0.07)]">
        <div className="flex gap-[10px] items-center mb-[10px]">
          <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-[14px] font-bold text-white" style={{ background: 'linear-gradient(135deg,#C8D4E8,#8FA3C4)' }}>
            리
          </div>
          <div>
            <p className="text-[13px] font-bold text-fg">리얼 인사이트</p>
            <p className="text-[11px] text-fg-subtle">구독자 3,200명</p>
          </div>
        </div>
        <p className="text-[11px] text-fg-muted leading-[1.5] mb-[10px]">알고리즘이 잘 보여주지 않는, 깊이 있는 관점의 채널입니다.</p>
        <p className="text-[12px] font-semibold text-fg mb-2">왜 지금 이 업종이 주목받는가</p>
        <div className="w-full h-7 bg-navy rounded-[6px] flex items-center justify-center text-[11px] text-white font-semibold">유튜브로 보기</div>
      </div>
    </div>
  );
}

/* ── 슬라이드 데이터 ── */
const SLIDES: {
  Visual: React.ComponentType;
  title: string;
  body: string;
  btnLabel: string;
}[] = [
  {
    Visual: Slide1Visual,
    title: '좋은 영상을 찾느라\n지치셨나요?',
    body: 'Cut off는 유튜브의 저품질 콘텐츠를 걸러내고, 볼 만한 영상만 남깁니다.',
    btnLabel: '다음',
  },
  {
    Visual: Slide2Visual,
    title: '오늘의 대표 추천과\n다른 추천을 함께 제공합니다.',
    body: '먼저 대표 영상을 보여드리고, 취향에 맞는 다른 추천도 바로 이어서 탐색할 수 있습니다.',
    btnLabel: '다음',
  },
  {
    Visual: Slide3Visual,
    title: '아직 알려지지 않은\n좋은 채널도 발견합니다.',
    body: '조회수는 낮지만 깊이 있는 영상과 아직 알려지지 않은 채널을 함께 소개합니다.',
    btnLabel: '관심사 선택하기',
  },
];

export default function OnboardPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const handleNext = useCallback(() => {
    if (current < SLIDES.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      navigate('/category', { replace: true });
    }
  }, [current, navigate]);

  return (
    <div className="min-h-dvh bg-surface flex flex-col pt-safe pb-safe overflow-hidden">
      {/* 슬라이드 트랙
          track width = 300vw (SLIDES.length × 100vw)
          translateX(-33.33%) = -100vw (slide 1 → 2)
          translateX(-66.66%) = -200vw (slide 2 → 3) */}
      <div
        className="flex flex-1 transition-transform duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          width: `${SLIDES.length * 100}%`,
          transform: `translateX(-${(current / SLIDES.length) * 100}%)`,
        }}
      >
        {SLIDES.map(({ Visual, title, body, btnLabel }, i) => (
          /* .ob-slide — width: 1/SLIDES.length of track (= 100vw), flex-col */
          <div
            key={i}
            className="flex flex-col px-7 pt-11 pb-8 min-h-dvh"
            style={{ width: `${100 / SLIDES.length}%` }}
          >
            {/* 진행 도트 — 각 슬라이드가 자신을 active로 표시 (해당 슬라이드만 보이므로 정확) */}
            <Dots total={SLIDES.length} current={i} />

            {/* 비주얼 영역 — flex-1, center */}
            <div className="flex-1 flex items-center justify-center mb-8">
              <Visual />
            </div>

            {/* 제목 */}
            <h1 className="text-[22px] font-bold text-fg leading-[1.35] mb-3 tracking-[-0.5px] whitespace-pre-line">
              {title}
            </h1>
            {/* 본문 */}
            <p className="text-[15px] text-fg-muted leading-[1.65] mb-8">
              {body}
            </p>
            {/* 버튼 */}
            <Button variant="primary" size="lg" fullWidth onClick={handleNext}>
              {btnLabel}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

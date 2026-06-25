/* ─────────────────────────────────────────────────────────────────
   VIDEO_LIST  — 전체 영상 마스터 데이터
   HTML 목업(UI_0624_초안.html)의 CATLIST_DATA + TODAYS_PICK_DATA 기반.
   ID 규칙: 12자리 숫자 문자열 (000000000001 ~ 000000000040)
   thumbnailUrl: null → getThumbnailBackground() 가 gradient 반환
   ───────────────────────────────────────────────────────────────── */

export interface Video {
  id: string;
  title: string;
  channel: string;
  /** 표시용 재생 시간 ex) "18:42" */
  duration: string;
  thumbnailUrl: string | null;
  /** Editor's Comment */
  editorComment: string;
  /** 영상 요약 */
  summary: string;
  /** ex) "05-11" */
  createdAt: string;
}

export interface SubCategoryVideos {
  subCategory: string;
  videos: Video[];
}

export interface BigCategoryVideos {
  bigCategory: string;
  subCategories: SubCategoryVideos[];
}

export const VIDEO_LIST: BigCategoryVideos[] = [
  {
    "bigCategory": "비즈니스",
    "subCategories": [
      {
        "subCategory": "branding",
        "videos": [
          {
            "id": "000000000001",
            "title": "브랜드는 왜 조용한 마케팅을 말하기 시작했나",
            "channel": "○○○ Studio",
            "duration": "18:42",
            "thumbnailUrl": null,
            "editorComment": "단순 트렌드 요약이 아니라, 브랜드 전략 관점에서 변화의 이유를 설명합니다. 실무자가 왜 이 흐름에 반응해야 하는지까지 다룹니다.",
            "summary": "최근 브랜드들이 대형 캠페인 대신 조용한 마케팅을 선택하는 이유를 분석합니다. 소비자 신뢰와 장기적 브랜드 자산 구축의 관점에서 이 전환의 의미를 다룹니다.",
            "createdAt": "05-11"
          },
          {
            "id": "000000000002",
            "title": "스타트업 브랜딩, 처음부터 다시 생각하는 법",
            "channel": "브랜드랩",
            "duration": "12:30",
            "thumbnailUrl": null,
            "editorComment": "로고나 색상보다 '왜'라는 질문에서 브랜딩을 시작해야 한다고 말합니다. 스타트업 창업자에게 꼭 필요한 관점입니다.",
            "summary": "브랜딩을 디자인이 아닌 철학의 문제로 접근합니다. 사례를 통해 초기 브랜딩의 핵심 원칙을 설명합니다.",
            "createdAt": "05-08"
          },
          {
            "id": "000000000003",
            "title": "브랜드 보이스를 만드는 실전 가이드",
            "channel": "카피스튜디오",
            "duration": "21:08",
            "thumbnailUrl": null,
            "editorComment": "말투 하나로 브랜드 온도가 달라지는 이유를 사례로 풀어냅니다.",
            "summary": "브랜드 보이스의 구성 요소와 실제 카피 작성 방식을 단계별로 설명합니다. 일관된 언어로 브랜드 정체성을 강화하는 방법을 다룹니다.",
            "createdAt": "05-05"
          },
          {
            "id": "000000000004",
            "title": "리브랜딩이 실패하는 3가지 이유",
            "channel": "브랜드포스트",
            "duration": "9:14",
            "thumbnailUrl": null,
            "editorComment": "인지도 높은 브랜드들의 리브랜딩 사례를 해부합니다.",
            "summary": "브랜드 교체 시 고객 신뢰를 잃는 구체적인 패턴을 분석합니다. 비주얼 변경 전에 반드시 해야 할 질문들을 제시합니다.",
            "createdAt": "05-01"
          },
          {
            "id": "000000000005",
            "title": "브랜드 아이덴티티와 브랜드 이미지의 차이",
            "channel": "전략연구소",
            "duration": "16:55",
            "thumbnailUrl": null,
            "editorComment": "기업이 의도한 것과 소비자가 받아들이는 것 사이의 간극을 다룹니다.",
            "summary": "아이덴티티(기업 의도)와 이미지(소비자 인식)가 왜 다를 수 있는지, 그 간극을 어떻게 좁힐지 구체적인 방법을 설명합니다.",
            "createdAt": "04-28"
          }
        ]
      },
      {
        "subCategory": "marketing",
        "videos": [
          {
            "id": "000000000006",
            "title": "2025년 SaaS 마케팅 전략 총정리",
            "channel": "마케팅클래스",
            "duration": "24:15",
            "thumbnailUrl": null,
            "editorComment": "데이터 기반으로 정리한 올해의 핵심 전략입니다. 실제 수치와 함께 설명합니다.",
            "summary": "PLG, SEO, 커뮤니티 마케팅 등 2025년 SaaS 기업이 집중해야 할 채널별 전략을 정리합니다. 실제 사례 데이터를 함께 제시합니다.",
            "createdAt": "05-11"
          },
          {
            "id": "000000000007",
            "title": "퍼포먼스 마케터가 말하는 진짜 리텐션",
            "channel": "그로스랩",
            "duration": "9:48",
            "thumbnailUrl": null,
            "editorComment": "숫자 뒤에 숨겨진 사용자 심리를 설명합니다. 이탈보다 잔류에 집중합니다.",
            "summary": "리텐션 지표가 좋아 보여도 실제 사용자가 이탈하는 이유를 행동 데이터로 분석합니다. 진짜 잔류를 만드는 온보딩 설계 방식을 제안합니다.",
            "createdAt": "05-09"
          },
          {
            "id": "000000000008",
            "title": "콘텐츠 마케팅이 팀 내에서 실패하는 이유",
            "channel": "마케터노트",
            "duration": "14:02",
            "thumbnailUrl": null,
            "editorComment": "전략보다 실행 구조 문제임을 조직 사례로 설명합니다.",
            "summary": "콘텐츠 마케팅이 성과를 내지 못하는 원인을 전략 부재가 아닌 팀 구조와 프로세스 문제로 진단합니다. 조직 내 콘텐츠 실행력을 높이는 방법을 다룹니다.",
            "createdAt": "05-06"
          },
          {
            "id": "000000000009",
            "title": "인플루언서 마케팅, 지금 효과 있나",
            "channel": "캠페인리뷰",
            "duration": "18:33",
            "thumbnailUrl": null,
            "editorComment": "플랫폼별 ROI 데이터를 토대로 현실적인 판단 기준을 제시합니다.",
            "summary": "인플루언서 마케팅의 실제 성과를 플랫폼별, 규모별로 데이터로 비교합니다. 예산 낭비를 줄이기 위한 파트너 선정 기준을 설명합니다.",
            "createdAt": "05-03"
          },
          {
            "id": "000000000010",
            "title": "B2B 마케팅에서 콘텐츠가 작동하는 방식",
            "channel": "B2B인사이트",
            "duration": "11:50",
            "thumbnailUrl": null,
            "editorComment": "구매 사이클이 긴 제품에서 콘텐츠의 역할을 설명합니다.",
            "summary": "B2B 구매 과정에서 콘텐츠가 신뢰를 쌓고 의사결정을 가속화하는 메커니즘을 설명합니다. 각 단계별 콘텐츠 전략을 제안합니다.",
            "createdAt": "04-30"
          }
        ]
      },
      {
        "subCategory": "commerce",
        "videos": [
          {
            "id": "000000000011",
            "title": "커머스 브랜드가 콘텐츠를 만들어야 하는 이유",
            "channel": "커머스인사이트",
            "duration": "16:00",
            "thumbnailUrl": null,
            "editorComment": "D2C 브랜드의 콘텐츠 전략 사례를 분석합니다.",
            "summary": "광고보다 콘텐츠가 장기적으로 더 효율적인 이유를 D2C 브랜드 사례로 설명합니다. 커머스 브랜드만의 콘텐츠 차별화 방향을 제안합니다.",
            "createdAt": "05-11"
          },
          {
            "id": "000000000012",
            "title": "올해 커머스 트렌드 5가지 정리",
            "channel": "커머스랩",
            "duration": "11:22",
            "thumbnailUrl": null,
            "editorComment": "국내외 커머스 시장 변화를 분석합니다.",
            "summary": "2025년 커머스 시장을 바꾸는 5가지 핵심 트렌드를 국내외 데이터와 함께 정리합니다. 셀러와 브랜드 모두에게 실질적인 시사점을 제시합니다.",
            "createdAt": "05-07"
          }
        ]
      },
      {
        "subCategory": "tech",
        "videos": [
          {
            "id": "000000000013",
            "title": "AI가 바꾸는 개발자의 일상",
            "channel": "테크인사이드",
            "duration": "19:05",
            "thumbnailUrl": null,
            "editorComment": "실제 현업 개발자가 말하는 변화입니다.",
            "summary": "Copilot, Cursor 등 AI 코딩 도구가 실제 개발 워크플로우에 어떤 변화를 가져왔는지 현업 개발자의 경험을 중심으로 분석합니다.",
            "createdAt": "05-11"
          },
          {
            "id": "000000000014",
            "title": "스타트업이 테크 스택을 고를 때",
            "channel": "빌더스",
            "duration": "14:33",
            "thumbnailUrl": null,
            "editorComment": "초기 팀이 흔히 저지르는 기술 선택 실수를 다룹니다.",
            "summary": "초기 스타트업에서 기술 스택 선택이 이후 확장성과 개발 속도에 미치는 영향을 설명합니다. 팀 규모와 제품 단계별 최적 스택 선택 기준을 제시합니다.",
            "createdAt": "05-04"
          }
        ]
      },
      {
        "subCategory": "business_strategy",
        "videos": [
          {
            "id": "000000000015",
            "title": "한국 스타트업 씬, 솔직한 10년 회고",
            "channel": "스타트업인사이드",
            "duration": "48:20",
            "thumbnailUrl": null,
            "editorComment": "10년간의 현장 경험을 바탕으로 생존 조건을 정리합니다.",
            "summary": "한국 스타트업 생태계의 10년을 돌아보며 살아남은 회사들의 공통점과 실패한 회사들의 패턴을 분석합니다. 지금 창업자가 알아야 할 현실적인 조언을 담았습니다.",
            "createdAt": "05-11"
          }
        ]
      },
      {
        "subCategory": "business_planning",
        "videos": [
          {
            "id": "000000000016",
            "title": "기획서보다 중요한 것",
            "channel": "기획연구소",
            "duration": "22:10",
            "thumbnailUrl": null,
            "editorComment": "문서가 아닌 사고 방식으로서의 기획을 다룹니다.",
            "summary": "좋은 기획서를 쓰는 기술보다 기획의 본질인 문제 정의와 맥락 파악이 왜 더 중요한지 설명합니다. 실무에서 기획력을 키우는 방법을 제안합니다.",
            "createdAt": "05-11"
          }
        ]
      }
    ]
  },
  {
    "bigCategory": "성장",
    "subCategories": [
      {
        "subCategory": "leadership",
        "videos": [
          {
            "id": "000000000017",
            "title": "팀을 움직이는 리더의 말 한마디",
            "channel": "리더십채널",
            "duration": "21:10",
            "thumbnailUrl": null,
            "editorComment": "설득이 아닌 신뢰로 이끄는 방식을 다룹니다.",
            "summary": "지시와 설득이 아닌 신뢰 기반 리더십이 왜 더 효과적인지, 실제 팀 운영 사례를 통해 설명합니다. 리더가 매일 사용할 수 있는 커뮤니케이션 방식을 제안합니다.",
            "createdAt": "05-11"
          },
          {
            "id": "000000000018",
            "title": "피드백을 두려워하지 않는 팀을 만드는 법",
            "channel": "조직문화랩",
            "duration": "15:44",
            "thumbnailUrl": null,
            "editorComment": "심리적 안전감을 설계하는 실제 방법을 소개합니다.",
            "summary": "팀원들이 솔직한 피드백을 주고받지 못하는 이유를 심리적 안전감 연구로 설명합니다. 관리자가 실천할 수 있는 구체적인 팀 문화 설계 방법을 소개합니다.",
            "createdAt": "05-07"
          },
          {
            "id": "000000000019",
            "title": "리더십은 배울 수 있는가",
            "channel": "HR인사이트",
            "duration": "28:00",
            "thumbnailUrl": null,
            "editorComment": "타고난 자질 vs 훈련 가능성을 연구 데이터로 다룹니다.",
            "summary": "리더십이 선천적 특성인지 후천적 역량인지에 대한 연구 결과를 정리합니다. 조직에서 리더를 육성하는 효과적인 방법론을 제안합니다.",
            "createdAt": "05-03"
          },
          {
            "id": "000000000020",
            "title": "1on1 미팅을 제대로 하는 방법",
            "channel": "매니저클래스",
            "duration": "11:20",
            "thumbnailUrl": null,
            "editorComment": "형식적 미팅을 실질적 성장 대화로 바꾸는 구조를 설명합니다.",
            "summary": "1on1 미팅이 형식에 그치는 이유와 실제로 팀원 성장을 이끌어내는 대화 구조를 설명합니다. 질문 예시와 함께 실천 가능한 미팅 프레임워크를 제시합니다.",
            "createdAt": "04-29"
          }
        ]
      },
      {
        "subCategory": "productivity",
        "videos": [
          {
            "id": "000000000021",
            "title": "집중력을 되찾는 5가지 루틴",
            "channel": "포커스랩",
            "duration": "8:55",
            "thumbnailUrl": null,
            "editorComment": "분산된 주의를 되돌리는 실용적 방법을 소개합니다.",
            "summary": "스마트폰과 알림이 집중력을 빼앗는 구조를 설명하고, 하루 중 집중 시간을 회복하는 5가지 루틴을 제안합니다. 즉시 실천 가능한 방법 위주로 구성됐습니다.",
            "createdAt": "05-11"
          },
          {
            "id": "000000000022",
            "title": "할 일 목록이 오히려 방해가 되는 이유",
            "channel": "워크랩",
            "duration": "13:12",
            "thumbnailUrl": null,
            "editorComment": "태스크 관리의 함정과 대안을 설명합니다.",
            "summary": "할 일 목록이 늘어날수록 오히려 생산성이 떨어지는 이유를 인지과학 연구로 설명합니다. 할 일보다 우선순위 결정이 더 중요한 이유와 대안적 방법을 제안합니다.",
            "createdAt": "05-06"
          },
          {
            "id": "000000000023",
            "title": "딥 워크를 실제로 실천하는 방법",
            "channel": "포커스랩",
            "duration": "19:40",
            "thumbnailUrl": null,
            "editorComment": "칼 뉴포트 이론을 현실에 맞게 재해석합니다.",
            "summary": "딥 워크 이론을 현실 직장인의 환경에 맞게 적용하는 방법을 설명합니다. 방해 요소를 제거하고 몰입 환경을 만드는 구체적인 전략을 제시합니다.",
            "createdAt": "05-02"
          },
          {
            "id": "000000000024",
            "title": "생산성을 두 배로 만드는 노션 사용법",
            "channel": "툴즈튜브",
            "duration": "8:22",
            "thumbnailUrl": null,
            "editorComment": "도구보다 사용 방식이 중요합니다. 노션을 제대로 쓰는 법을 보여줍니다.",
            "summary": "노션을 단순 메모 도구로 쓰는 것과 시스템으로 구축하는 것의 차이를 설명합니다. 작업 흐름을 2배 빠르게 만드는 노션 템플릿과 구조를 소개합니다.",
            "createdAt": "04-27"
          }
        ]
      },
      {
        "subCategory": "self_development",
        "videos": [
          {
            "id": "000000000025",
            "title": "자기계발이 효과 없을 때 보는 영상",
            "channel": "성장채널",
            "duration": "17:20",
            "thumbnailUrl": null,
            "editorComment": "방향 없는 노력이 왜 소모적인지 설명합니다.",
            "summary": "열심히 하는데도 성장하지 못하는 이유를 '방향성'과 '피드백 루프' 부재로 진단합니다. 자기계발을 의미 있게 만드는 전략과 자기 평가 방법을 제안합니다.",
            "createdAt": "05-11"
          }
        ]
      },
      {
        "subCategory": "book_review",
        "videos": [
          {
            "id": "000000000026",
            "title": "책 한 권을 내 것으로 만드는 법",
            "channel": "북클럽",
            "duration": "13:40",
            "thumbnailUrl": null,
            "editorComment": "읽기에서 적용까지의 루프를 설계합니다.",
            "summary": "책을 읽어도 실천으로 이어지지 않는 이유를 설명합니다. 독서 노트 방법부터 주기적 복습 시스템까지, 책 한 권을 실제 변화로 연결하는 구체적인 루프를 소개합니다.",
            "createdAt": "05-11"
          }
        ]
      }
    ]
  },
  {
    "bigCategory": "문화·라이프",
    "subCategories": [
      {
        "subCategory": "humanities",
        "videos": [
          {
            "id": "000000000027",
            "title": "철학이 삶을 바꾸는 방식",
            "channel": "인문채널",
            "duration": "32:00",
            "thumbnailUrl": null,
            "editorComment": "추상적 개념을 일상 언어로 풀어냅니다.",
            "summary": "철학적 개념이 실제 삶의 결정과 태도에 어떻게 영향을 미치는지 구체적인 사례로 설명합니다. 소크라테스부터 현대 철학까지 일상에 적용 가능한 통찰을 전달합니다.",
            "createdAt": "05-11"
          },
          {
            "id": "000000000028",
            "title": "스토아 철학을 현대인이 쓸 수 있는 방법",
            "channel": "철학노트",
            "duration": "24:10",
            "thumbnailUrl": null,
            "editorComment": "불안과 통제에 대한 고대의 답을 현재 언어로 번역합니다.",
            "summary": "스토아 철학의 핵심 원칙인 '통제 가능한 것과 불가능한 것의 구분'을 현대 직장인의 삶에 적용하는 방법을 설명합니다. 일상의 불안을 줄이는 실용적 관점을 제안합니다.",
            "createdAt": "05-05"
          }
        ]
      },
      {
        "subCategory": "design",
        "videos": [
          {
            "id": "000000000029",
            "title": "좋은 디자인은 어디서 시작하는가",
            "channel": "디자인코드",
            "duration": "15:22",
            "thumbnailUrl": null,
            "editorComment": "미학보다 기능에서 출발하는 디자인 철학입니다.",
            "summary": "디자인의 시작점이 시각적 아름다움이 아닌 문제 정의임을 설명합니다. 좋은 디자인이 탄생하는 과정을 실제 프로젝트 사례를 통해 보여줍니다.",
            "createdAt": "05-11"
          },
          {
            "id": "000000000030",
            "title": "타이포그래피가 브랜드를 만든다",
            "channel": "폰트스튜디오",
            "duration": "10:45",
            "thumbnailUrl": null,
            "editorComment": "글꼴 선택이 인상에 미치는 심리적 효과를 분석합니다.",
            "summary": "폰트 하나가 브랜드 신뢰도와 감성에 미치는 영향을 심리학 연구로 설명합니다. 브랜드 타이포그래피를 선택할 때 고려해야 할 기준을 제시합니다.",
            "createdAt": "05-07"
          },
          {
            "id": "000000000031",
            "title": "디자인 시스템 없이 스케일하면 생기는 일",
            "channel": "디자인코드",
            "duration": "14:10",
            "thumbnailUrl": null,
            "editorComment": "디자인 시스템의 부재가 조직에 미치는 영향을 다룹니다.",
            "summary": "디자인 시스템 없이 빠르게 성장한 제품들이 겪는 일관성 붕괴와 개발 비효율을 사례로 설명합니다. 작은 팀도 시작할 수 있는 디자인 시스템 구축 방법을 소개합니다.",
            "createdAt": "05-01"
          }
        ]
      },
      {
        "subCategory": "wellness",
        "videos": [
          {
            "id": "000000000032",
            "title": "번아웃을 예방하는 회복의 기술",
            "channel": "웰니스채널",
            "duration": "11:05",
            "thumbnailUrl": null,
            "editorComment": "에너지 관리를 시스템으로 접근합니다.",
            "summary": "번아웃의 초기 신호를 인식하는 방법과 에너지를 시스템적으로 관리하는 방법을 설명합니다. 일과 회복의 균형을 잡는 실용적인 루틴을 제안합니다.",
            "createdAt": "05-11"
          },
          {
            "id": "000000000033",
            "title": "수면이 성과에 미치는 영향",
            "channel": "바이오해킹랩",
            "duration": "16:30",
            "thumbnailUrl": null,
            "editorComment": "수면 부채가 인지 능력에 끼치는 영향을 데이터로 설명합니다.",
            "summary": "수면 시간 부족이 의사결정력, 창의성, 감정 조절에 미치는 영향을 연구 데이터로 설명합니다. 수면의 질을 높이는 실용적인 방법을 소개합니다.",
            "createdAt": "05-04"
          }
        ]
      },
      {
        "subCategory": "space",
        "videos": [
          {
            "id": "000000000034",
            "title": "공간이 사람을 바꾼다",
            "channel": "공간스튜디오",
            "duration": "22:48",
            "thumbnailUrl": null,
            "editorComment": "환경 설계가 행동에 미치는 영향을 탐구합니다.",
            "summary": "주거 공간과 업무 공간의 설계가 집중력, 창의성, 감정 상태에 미치는 영향을 연구와 사례로 설명합니다. 공간을 바꾸어 삶을 개선하는 방법을 제안합니다.",
            "createdAt": "05-11"
          }
        ]
      },
      {
        "subCategory": "art",
        "videos": [
          {
            "id": "000000000035",
            "title": "현대 미술이 어렵게 느껴지는 이유",
            "channel": "아트채널",
            "duration": "18:00",
            "thumbnailUrl": null,
            "editorComment": "맥락 없이 보는 것과 맥락을 알고 보는 것의 차이를 다룹니다.",
            "summary": "현대 미술이 일반 관람객에게 난해하게 느껴지는 이유를 역사적 맥락으로 설명합니다. 작품을 이해하는 데 필요한 최소한의 배경 지식을 쉽게 전달합니다.",
            "createdAt": "05-11"
          }
        ]
      },
      {
        "subCategory": "fashion_beauty",
        "videos": [
          {
            "id": "000000000036",
            "title": "패션 브랜드가 말하지 않는 것들",
            "channel": "패션인사이드",
            "duration": "14:30",
            "thumbnailUrl": null,
            "editorComment": "트렌드의 이면에 있는 산업 구조를 설명합니다.",
            "summary": "패스트 패션과 럭셔리 브랜드의 마케팅 전략 이면에 숨겨진 산업 구조와 지속 가능성 문제를 다룹니다. 소비자로서 더 현명하게 선택하는 방법을 제안합니다.",
            "createdAt": "05-11"
          }
        ]
      },
      {
        "subCategory": "f_and_b",
        "videos": [
          {
            "id": "000000000037",
            "title": "식당이 망하는 진짜 이유",
            "channel": "F&B리서치",
            "duration": "20:15",
            "thumbnailUrl": null,
            "editorComment": "맛보다 운영과 위치의 문제임을 데이터로 풀어냅니다.",
            "summary": "외식업 폐업 통계를 분석하여 맛이 아닌 운영, 위치, 자금 관리 문제가 실패의 주요 원인임을 보여줍니다. 창업 전에 반드시 확인해야 할 리스크 체크리스트를 제시합니다.",
            "createdAt": "05-11"
          }
        ]
      },
      {
        "subCategory": "travel",
        "videos": [
          {
            "id": "000000000038",
            "title": "여행을 다르게 만드는 준비의 기술",
            "channel": "여행연구소",
            "duration": "12:40",
            "thumbnailUrl": null,
            "editorComment": "일정 채우기가 아닌 여백 설계의 관점을 소개합니다.",
            "summary": "빡빡한 일정의 여행보다 여백이 있는 여행이 더 기억에 남는 이유를 심리학 연구로 설명합니다. 여행을 진짜 경험으로 만드는 준비 방법을 제안합니다.",
            "createdAt": "05-11"
          }
        ]
      }
    ]
  },
  {
    "bigCategory": "트렌드",
    "subCategories": [
      {
        "subCategory": "trend",
        "videos": [
          {
            "id": "000000000039",
            "title": "2025년 상반기 소비 트렌드 총정리",
            "channel": "트렌드랩",
            "duration": "16:30",
            "thumbnailUrl": null,
            "editorComment": "데이터로 읽는 올해 소비 패턴의 변화입니다.",
            "summary": "2025년 상반기 소비 데이터를 세대별, 카테고리별로 분석합니다. 하반기 비즈니스 전략에 활용할 수 있는 핵심 소비 트렌드 시사점을 정리합니다.",
            "createdAt": "05-11"
          }
        ]
      },
      {
        "subCategory": "contents",
        "videos": [
          {
            "id": "000000000040",
            "title": "숏폼 이후, 콘텐츠의 다음 형식은",
            "channel": "콘텐츠연구소",
            "duration": "12:15",
            "thumbnailUrl": null,
            "editorComment": "롱폼 회귀 현상과 새로운 포맷을 분석합니다.",
            "summary": "숏폼 콘텐츠의 과포화 이후 롱폼과 오디오 콘텐츠가 다시 주목받는 이유를 플랫폼 데이터로 분석합니다. 크리에이터와 브랜드가 주목해야 할 다음 포맷을 전망합니다.",
            "createdAt": "05-11"
          }
        ]
      }
    ]
  }
];

/* ── 썸네일 gradient 매핑 (thumbnailUrl = null 일 때 사용) ── */
const THUMBNAIL_GRADIENTS: Record<string, string> = {
  "000000000001": "linear-gradient(135deg,#C8D4E8,#8FA3C4)",
  "000000000002": "linear-gradient(135deg,#D4DCE8,#A8BAD0)",
  "000000000003": "linear-gradient(135deg,#C8CCE8,#909CC4)",
  "000000000004": "linear-gradient(135deg,#D8D4E8,#B0ACC4)",
  "000000000005": "linear-gradient(135deg,#D0D8E8,#A0ACCC)",
  "000000000006": "linear-gradient(135deg,#D4E8DC,#A0C4B0)",
  "000000000007": "linear-gradient(135deg,#E8D4DC,#C4A0B0)",
  "000000000008": "linear-gradient(135deg,#CCE8D8,#98C4A8)",
  "000000000009": "linear-gradient(135deg,#C8E8D8,#90C4A8)",
  "000000000010": "linear-gradient(135deg,#D0E8D4,#A0C8A8)",
  "000000000011": "linear-gradient(135deg,#E8E4D4,#C4BC9C)",
  "000000000012": "linear-gradient(135deg,#E4E8D4,#BCC4A0)",
  "000000000013": "linear-gradient(135deg,#D4E4E8,#9CB8C4)",
  "000000000014": "linear-gradient(135deg,#E8D4E4,#C4A0BC)",
  "000000000015": "linear-gradient(135deg,#E4E8D4,#BCC4A0)",
  "000000000016": "linear-gradient(135deg,#D8E4D4,#ACBCA8)",
  "000000000017": "linear-gradient(135deg,#D4E8E4,#9CC4B8)",
  "000000000018": "linear-gradient(135deg,#C8E4E0,#90C0BC)",
  "000000000019": "linear-gradient(135deg,#D0E8E4,#98C4BC)",
  "000000000020": "linear-gradient(135deg,#CCE4E0,#90BCBC)",
  "000000000021": "linear-gradient(135deg,#E4D4E8,#B8A0C4)",
  "000000000022": "linear-gradient(135deg,#DCD4E8,#B0A0C8)",
  "000000000023": "linear-gradient(135deg,#D8D0E8,#ACA0C4)",
  "000000000024": "linear-gradient(135deg,#E8E4D4,#C4BC9C)",
  "000000000025": "linear-gradient(135deg,#D0D4E8,#9CA8C4)",
  "000000000026": "linear-gradient(135deg,#E8E4D0,#C8BC9C)",
  "000000000027": "linear-gradient(135deg,#E8D4C8,#C4A48F)",
  "000000000028": "linear-gradient(135deg,#E4CCC4,#C0988C)",
  "000000000029": "linear-gradient(135deg,#D4D0E8,#A8A0C8)",
  "000000000030": "linear-gradient(135deg,#CCC8E4,#A09CC8)",
  "000000000031": "linear-gradient(135deg,#D4D8E4,#A8B0C8)",
  "000000000032": "linear-gradient(135deg,#D4E8D0,#A0C89C)",
  "000000000033": "linear-gradient(135deg,#CCE4C8,#98C494)",
  "000000000034": "linear-gradient(135deg,#E8E0D4,#C8B8A0)",
  "000000000035": "linear-gradient(135deg,#E8D8D0,#C8B0A0)",
  "000000000036": "linear-gradient(135deg,#E8D4E0,#C8A0B8)",
  "000000000037": "linear-gradient(135deg,#E8DCD4,#C8B8A8)",
  "000000000038": "linear-gradient(135deg,#C8D8E8,#98B4CC)",
  "000000000039": "linear-gradient(135deg,#D4C8E8,#A89CC4)",
  "000000000040": "linear-gradient(135deg,#C8D8E8,#90A8C4)"
};

export function getThumbnailBackground(id: string, thumbnailUrl: string | null): string {
  if (thumbnailUrl) return thumbnailUrl;
  return THUMBNAIL_GRADIENTS[id] ?? 'linear-gradient(135deg,#EBEBEB,#D0D0D0)';
}

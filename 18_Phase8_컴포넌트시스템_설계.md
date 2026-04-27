# 18. Phase 8 설계 계획 — 섹션 컴포넌트 시스템 (Shopify Sections 패턴)

**작성**: 2026-04-26 07:28  ·  Cowork Design Agent (시니어 프로덕트 디자이너 관점)
**상위**: Phase 1~7 (레퍼런스 분석·패턴·큐레이션) → **Phase 8 (컴포넌트 시스템 설계)**
**목표 요약**: 사용자 입력 데이터(DB)는 고정, 섹션 레이아웃만 바꿔 끼울 수 있는 빌더 시스템 (Shopify Sections / Webflow / Framer 패턴)

---

## 0. 목표 파악 — 핵심 메커니즘

### 0.1 사용자가 원하는 메커니즘

```
  관리자(클라이언트)                                            
  ┌──────────────┐                                              
  │ 섹션: Hero   │ ← 클릭                                        
  │ ▾ Layout 변경 ┼──┐                                          
  └──────────────┘   │                                          
         ▲           │                                           
  ┌──────┴──────────┐│                                           
  │ Variant 선택    ││                                           
  │ ○ Split (default)│                                           
  │ ● Full-bleed    ││ ← 선택                                    
  │ ○ Stacked       ││                                           
  └─────────────────┘│                                           
         ▼           ▼                                           
  ┌────────────────────┐                                         
  │ DB (변경 안됨)     │                                         
  │ headline: "..."    │ ──→ render with NEW variant component  
  │ subheadline: "..." │                                         
  │ ctaLabel: "..."    │                                         
  │ image: ...         │                                         
  └────────────────────┘                                         
```

### 0.2 핵심 원칙 — 데이터·레이아웃 분리 (Decoupled Schema)

| 레이어 | 변경 가능 | 책임 |
|---|---|---|
| **데이터 스키마** (DB/JSON) | ❌ 안정 (Stable Contract) | 모든 variant가 동일한 키로 접근 |
| **레이아웃 컴포넌트** | ✅ 자유 | variant마다 데이터를 다르게 시각화 |
| **콘텐츠 (값)** | ✅ 클라이언트별 | 같은 키 같은 타입, 값만 변경 |

이 분리가 **Shopify Sections / Webflow Sections / Framer**의 핵심이고, 본 라이브러리도 동일 패턴을 채용해야 합니다.

---

## 1. 핵심 아키텍처 — 4 레이어

```
┌─────────────────────────────────────────────────┐
│  Layer 1: Section Schema (안정 데이터 계약)      │
│  · JSON Schema · TypeScript Interface           │
└─────────────────────────────────────────────────┘
               ▼ (read-only, schema-fixed)
┌─────────────────────────────────────────────────┐
│  Layer 2: Variant Library (Figma Components)    │
│  · 섹션당 N개 variant · 모두 같은 schema 소비    │
└─────────────────────────────────────────────────┘
               ▼ (1:1 mapping)
┌─────────────────────────────────────────────────┐
│  Layer 3: Code Components (React/HTML)          │
│  · 동일 props interface · 시각만 다름            │
└─────────────────────────────────────────────────┘
               ▼ (registered to)
┌─────────────────────────────────────────────────┐
│  Layer 4: Builder UI (관리자 GUI)                │
│  · 섹션 추가·삭제·순서변경·variant 선택           │
└─────────────────────────────────────────────────┘
```

---

## 2. Layer 1 — 섹션 데이터 스키마 (16종)

각 섹션이 **"어떤 키를 가진 데이터를 받는가"**를 먼저 확정해야 variant들이 호환됩니다.

### 2.1 Schema 정의 원칙
1. **모든 variant 공통 키만** schema에 포함 (특정 variant 전용 키 금지)
2. **확장 필드는 optional** (`?` 표기) — 일부 variant만 사용
3. **enum 값**은 변형 축에서 허용된 값만 (Tags 시트 참조)
4. **nullable 금지** — 빈 값은 빈 배열·빈 문자열로 (UI 깨짐 방지)

### 2.2 16 섹션 스키마 초안 (TypeScript Interface)

```typescript
// ──── 공통 베이스 ────
interface SectionBase {
  id: string;                  // unique 인스턴스 id
  type: SectionType;           // "hero" | "lead-form" | ...
  variant: string;             // "A" | "B" | "C" ... (variant key)
  visible: boolean;            // 섹션 on/off
  order: number;               // 페이지 내 순서
}

// ──── S1 GNB ────
interface GNBSection extends SectionBase {
  type: "gnb";
  logo: { src: string; alt: string };
  menus: { label: string; href: string }[];   // 최대 6개
  cta?: { label: string; href: string };
  sticky: boolean;
}

// ──── S2 Hero ────
interface HeroSection extends SectionBase {
  type: "hero";
  headline: string;            // 1~3줄
  subheadline?: string;
  visual: {
    type: "photo" | "illust" | "lottie" | "none";
    src?: string;              // visual.type !== "none"
    alt?: string;
  };
  primaryCTA?: { label: string; href: string };
  // Variant A (split)일 때 form: 하단 S3와 연동
}

// ──── S3 리드폼 (Hero 인접) ────
interface LeadFormSection extends SectionBase {
  type: "lead-form";
  fields: LeadFormField[];     // 4~5개 권장
  consent: { label: string; required: boolean }[];
  ctaLabel: string;            // "보험료 확인하기" 등
  endpoint: string;            // Formspree URL
}
interface LeadFormField {
  key: "name" | "phone" | "birthdate" | "gender" | "email";
  label: string;
  type: "text" | "tel" | "date" | "toggle" | "select";
  required: boolean;
  options?: { label: string; value: string }[];  // toggle/select용
}

// ──── S5 수치카드 ────
interface MetricsSection extends SectionBase {
  type: "metrics";
  metrics: { value: string; label: string; baseDate: string; iconKey?: string }[];
}

// ──── S6 상품카드 그리드 ────
interface ProductCardsSection extends SectionBase {
  type: "product-cards";
  cards: {
    title: string;
    headline: string;          // 질문형 카피
    iconKey: string;           // Lucide icon name
    href: string;
    bgTone?: "soft-purple" | "soft-blue" | "soft-green" | "soft-amber" | "soft-pink";
  }[];
}

// ──── S7 로고월 ────
interface LogoWallSection extends SectionBase {
  type: "logo-wall";
  groups: {
    label: "생명보험" | "손해보험" | "기타";
    logos: { src: string; alt: string }[];
  }[];
}

// ──── S11 비교카드 ────
interface CompareCardsSection extends SectionBase {
  type: "compare-cards";
  conditionLabel: string;      // "30세 남성·1억원 기준"
  cards: {
    insurer: string;           // "D손해보험"
    priceMasked: string;       // "***,***원"
    features: string[];
    href: string;
  }[];
}

// ──── S16 Footer ────
interface FooterSection extends SectionBase {
  type: "footer";
  business: {
    name: string;
    ceo: string;
    address: string;
    bizRegNo: string;
    telesalesNo: string;
    phone: string;
    email: string;
  };
  compliance: string[];        // 준법 문구
  links: { label: string; href: string }[];
  snsLinks?: { type: "youtube"|"instagram"|"facebook"|"blog"; href: string }[];
}
```

나머지 섹션(S4·S8~S15) schema는 Phase 8.1 단계에서 동일 원칙으로 정의.

---

## 3. Layer 2 — Figma Component Variants 시스템

### 3.1 컴포넌트 네이밍 규칙

Figma 네이밍은 **자동 매핑·검색·코드 동기화** 모두 영향을 줍니다. 다음 규칙 권고:

```
mp/section/{section-key}/{variant-key}

예시:
  mp/section/gnb/A           — GNB 변형 A
  mp/section/hero/split      — Hero split 레이아웃
  mp/section/lead-form/as-hero — 리드폼 as_hero variant
  mp/section/lead-form/inline-dark — 리드폼 본문 중단형
  mp/section/logo-wall/separated — 로고월 생·손 분리
```

- `mp/` = 엠플랜잇 네임스페이스
- 슬래시 = Figma Component Set 자동 그룹핑
- variant-key는 **kebab-case** + Tags 시트 enum 값과 1:1 매칭

### 3.2 Component Properties 매핑

각 컴포넌트는 schema의 키 = Figma Component Property로 노출:

| Schema 키 | Figma Property Type | 예 |
|---|---|---|
| `headline` (string) | **Text** | "당신에게 맞는 보험" |
| `visual.src` (image) | **Instance Swap** | photo · illust 슬롯 |
| `cta.label` (string) | **Text** | "지금 확인하기" |
| `sticky` (boolean) | **Boolean** | true/false |
| `visual.type` (enum) | **Variant Property** | photo·illust·lottie·none |

schema 키 = Figma property name 1:1 매칭 시 코드 동기화 자동화 가능.

### 3.3 Variant 매트릭스 (1차 채택 + 조건부 = 약 21개)

Phase 5 §3 매트릭스 기반으로 컴포넌트화 대상:

| 섹션 | 컴포넌트 | Variant 키 | 패턴 출처 | 우선순위 |
|---|---|---|---|---|
| S1 | mp/section/gnb | A | 키움식 심플 top-nav | 1차 |
| S2 | mp/section/hero | split | 키움·메리츠·메타리치 | 1차 |
| S3 | mp/section/lead-form | as-hero | 키움·메리츠 (Hero 인접) | 1차 |
| S3 | mp/section/lead-form | inline-dark | 키움 (이중 폼 본문 중단) | 1차 |
| S3 | mp/section/lead-form | right-sticky | 캐롯 (검증 후) | 조건부 |
| S4 | mp/section/lead-form-bottom | A | 키움 dark-blue | 1차 (S3 inline-dark와 통합 검토) |
| S5 | mp/section/metrics | A-3to4 | 굿리치·메리츠 GA형 | 1차 |
| S6 | mp/section/product-cards | 3col-illust | 메리츠 질문형 | 1차 |
| S6 | mp/section/product-cards | 5col-symbol | 굿리치 심볼 | 조건부 (백업) |
| S6 | mp/section/product-cards | dual-cta | 캐롯 신규/기존 | 조건부 |
| S7 | mp/section/logo-wall | separated | 메타리치 ⭐ | 1차 |
| S8 | mp/section/step-flow | horizontal-3 | 키움 추정 | 1차 |
| S9 | mp/section/consultant | single-photo | 메타리치 | 1차 (초상권 클리어 후) |
| S10 | mp/section/data-chart | svg-line | 굿리치 | 1차 |
| S11 | mp/section/compare-cards | masked-initial | 키움 D/K/H | 1차 |
| S12 | mp/section/persona | 3to4-illust | 메리츠 | 1차 |
| S13 | mp/section/faq | line-accordion | KB·토스·카카오 | 1차 |
| S14 | mp/section/testimonial | masked | 메리츠 | 1차 |
| S15 | mp/section/sticky-cta | floating-2btn | 메리츠 | 1차 |
| S15 | mp/section/sticky-cta | bottom-bar | 삼성화재 | 조건부 (모바일 백업) |
| S16 | mp/section/footer | red-warning | 메타리치 준법 | 1차 |
| S16 | mp/section/footer | minimal-light | 굿리치·보맵 | 조건부 |

**총 22개 variants** (1차 16개 + 조건부 6개). v2~v3에서 새 variant 추가 시 동일 schema 준수만 강제.

### 3.4 Figma 작업 순서 (Phase 8.2)
1. `_엠플랜잇 큐레이션 v1` 페이지 옆에 새 페이지 `_엠플랜잇 컴포넌트 v1` 생성
2. 섹션별 Component Set 16개 생성 (위 표 따라)
3. 각 Component Set 내부에 1차+조건부 variant 인스턴스 배치
4. Component Property 정의 (Text·Boolean·Variant·Instance Swap)
5. Auto Layout · Constraints 적용 (반응형 데스크톱·모바일 동시 지원)
6. Component description에 schema 키 명시 (코드 매핑 단서)

---

## 4. Layer 3 — 코드 컴포넌트 매핑 전략

### 4.1 디렉토리 구조 권고

```
design_v1.0/
  src/
    sections/
      Hero/
        Hero.types.ts        — schema interface (Layer 1)
        Hero.split.tsx       — variant A (split layout)
        Hero.full.tsx        — variant B (full-bleed)
        Hero.stacked.tsx     — variant C
        Hero.styles.css
        index.ts             — variant registry
      LeadForm/
        LeadForm.types.ts
        LeadForm.asHero.tsx
        LeadForm.inlineDark.tsx
        LeadForm.rightSticky.tsx
        index.ts
      ...
    sections.registry.ts     — 모든 섹션·variant 등록
    builder/                 — 빌더 UI (Layer 4)
```

### 4.2 Variant Registry 패턴

```typescript
// sections.registry.ts
export const SECTION_REGISTRY = {
  hero: {
    schema: HeroSchema,
    variants: {
      "split": Hero.split,
      "full":  Hero.full,
      "stacked": Hero.stacked,
    },
    defaultVariant: "split",
  },
  "lead-form": {
    schema: LeadFormSchema,
    variants: {
      "as-hero":      LeadForm.asHero,
      "inline-dark":  LeadForm.inlineDark,
      "right-sticky": LeadForm.rightSticky,
    },
    defaultVariant: "as-hero",
  },
  // ... 16 sections
};

// 렌더링
function renderSection(s: SectionInstance) {
  const Component = SECTION_REGISTRY[s.type].variants[s.variant];
  return <Component {...s.data} />;
}
```

이 구조라면 **새 variant 추가 = 파일 1개 + registry 1줄**. schema 변경은 모든 variant에 동시 영향.

---

## 5. Layer 4 — 빌더 UI 스펙 (Shopify-style)

### 5.1 화면 구성 (3패널 레이아웃)

```
┌──── 좌측: 섹션 리스트 ──┬──── 중앙: 라이브 프리뷰 ────┬── 우측: variant 패널 ──┐
│ ☰ GNB              ✎  │                              │ Hero                    │
│ ☰ Hero            ✎ ✱ │  [실제 렌더링된 Hero]         │ ─────────────           │
│ ☰ 리드폼            ✎  │                              │ Layout                  │
│ ☰ 수치카드          ✎  │  [실제 렌더링된 리드폼]       │ ● Split (default)       │
│ ☰ 상품카드          ✎  │                              │ ○ Full-bleed            │
│ ☰ 로고월            ✎  │  [실제 렌더링된 수치카드]     │ ○ Stacked               │
│ ...                    │                              │                         │
│ ☰ Footer           ✎  │  [...]                       │ Content                 │
│                        │                              │ Headline: [____]        │
│ + 섹션 추가            │                              │ CTA: [____]             │
└────────────────────────┴──────────────────────────────┴─────────────────────────┘
```

### 5.2 인터랙션 시나리오
1. **섹션 추가**: 좌측 + 버튼 → 16종 카드 모달 → 클릭 → 페이지 끝에 default variant로 추가
2. **순서 변경**: ☰ 핸들 드래그&드롭
3. **variant 변경**: 우측 패널의 라디오 버튼 → **즉시 프리뷰 반영** (동일 데이터, 다른 컴포넌트)
4. **콘텐츠 편집**: 우측 폼 필드 → 즉시 프리뷰 반영
5. **on/off**: 좌측 ✱ 토글 (visible 필드)
6. **변형 비교**: variant 라디오 hover 시 → 프리뷰에 미리보기 오버레이 (옵션)

### 5.3 핵심 UX 원칙
- **데이터 보존 (Data Persistence)**: variant 변경해도 입력한 콘텐츠 사라지지 않음
- **부분 호환 처리**: variant B에 없는 필드는 hidden, 다시 A로 돌아오면 복원
- **Default 안전장치**: 빈 데이터로 추가해도 placeholder 텍스트로 깨지지 않음
- **Live Preview**: 변경 즉시 반영 — 별도 "저장" 클릭 없이도 프리뷰됨
- **Undo/Redo**: 최소 10단계 히스토리

---

## 6. 4단계 실행 계획 (Phase 8.1 ~ 8.4)

| Phase | 산출물 | 소요 | 의존성 |
|---|---|---|---|
| **8.1** 데이터 스키마 확정 | TypeScript interface 16종 + JSON Schema export | 1일 | 본 보고 승인 |
| **8.2** Figma Component Variants 빌드 | 새 페이지 `_엠플랜잇 컴포넌트 v1` 에 22 variants | 2~3일 | 8.1 완료 |
| **8.3** 빌더 UI 스펙 (와이어프레임 + 인터랙션 명세) | Figma 와이어 + UX flow 문서 | 1일 | 8.1·8.2 |
| **8.4** 코드 컴포넌트 매핑 (1차 = Hero 1개로 PoC) | React/HTML 코드 + 등록 + 빌더 PoC 페이지 | 2일 | 8.1·8.2 |

**총 6~7일** 내 v1 컴포넌트 시스템 PoC 완성. 이후 v1.1 = 22 variants 전체 코드 구현, v1.2 = 빌더 UI 풀 구현.

---

## 7. 즉시 결정 요청 (PM·디자이너 합의 필요)

### Q1. 컴포넌트 범위 — 1차+조건부 22개 OK?
- 옵션 A: **22 variants 전체** (1차 16 + 조건부 6) — 권고
- 옵션 B: 1차 16개만 (조건부는 v2 보류)

### Q2. Figma Component Set 분리 정책
- 옵션 A: 섹션당 1 Component Set, variant는 Component Property `variant` 로 — 권고
- 옵션 B: 섹션·variant 별도 Component (자유도 높지만 동기화 어려움)

### Q3. Schema 첫 PoC 섹션
Phase 8.1·8.2·8.4 PoC 1개 섹션 우선 구현. 후보:
- 옵션 A: **S2 Hero** (가장 단순한 schema, 시각 임팩트 큼) — 권고
- 옵션 B: S3 리드폼 (가장 중요하지만 schema 복잡)
- 옵션 C: S6 상품카드 (CRUD 패턴 학습)

### Q4. 다음 즉시 작업 선택
- 옵션 A: **Phase 8.1 — 16 섹션 schema 전체 정의** (.ts 파일 생성, 1일)
- 옵션 B: Phase 8.2 — Figma 컴포넌트 페이지 빌드부터 (schema는 동시 정의)
- 옵션 C: Phase 8.4 PoC — Hero 1개 풀 스택 구현 (디자인+코드)

---

## 8. 산출물 위치 (예정)

- `랜딩페이지/18_Phase8_컴포넌트시스템_설계.md` (본 문서)
- `랜딩페이지/19_섹션_스키마_v1.ts` (Phase 8.1)
- Figma 페이지 `_엠플랜잇 컴포넌트 v1 (Cowork)` (Phase 8.2)
- `랜딩페이지/20_빌더UI_스펙.md` (Phase 8.3)
- `design_v1.0/src/sections/Hero/` (Phase 8.4 PoC)

---

_본 보고는 시니어 프로덕트 디자이너 관점의 시스템 아키텍처 제안입니다. 데이터·레이아웃 분리는 향후 6개월 이상의 모든 클라이언트 랜딩에 적용되는 **기반 자산**이므로, 첫 단추(스키마)를 신중히 결정하시길 권합니다._

**End of Plan.**

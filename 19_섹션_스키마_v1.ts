/**
 * 19_섹션_스키마_v1.ts
 * 엠플랜잇 GA 랜딩 — 섹션 데이터 스키마 v1
 *
 * 설계 원칙 (Phase 8 §2.1):
 *   1) 모든 variant 공통 키만 schema에 포함
 *   2) 확장 필드는 optional (`?`)
 *   3) enum 값은 변형 축에서 허용된 값만
 *   4) nullable 금지 — 빈 값은 빈 배열·빈 문자열로
 *
 * Generated: 2026-04-26 07:31 · Cowork Design Agent
 */

// ============================================================
//  COMMON TYPES
// ============================================================

export type SectionType =
  | "gnb"
  | "hero"
  | "lead-form"
  | "lead-form-bottom"
  | "metrics"
  | "product-cards"
  | "logo-wall"
  | "step-flow"
  | "consultant"
  | "data-chart"
  | "compare-cards"
  | "persona"
  | "faq"
  | "testimonial"
  | "sticky-cta"
  | "footer";

/** 모든 섹션 인스턴스가 공유하는 베이스 필드. */
export interface SectionBase {
  /** unique 인스턴스 id (UUID 등) */
  id: string;
  /** 섹션 종류 — Variant Registry 키와 매칭 */
  type: SectionType;
  /** Figma Variant key (kebab-case) — Layer 2 컴포넌트 변형 매핑 */
  variant: string;
  /** 페이지에서의 표시 여부 */
  visible: boolean;
  /** 페이지 내 정렬 순서 (오름차순) */
  order: number;
}

/** 공통 CTA 객체 */
export interface CTA {
  label: string;
  href: string;
  /** Lucide icon name (선택) */
  iconKey?: string;
}

/** 공통 이미지 객체 */
export interface Image {
  src: string;
  alt: string;
  /** 2x retina 옵션 */
  src2x?: string;
}

// ============================================================
//  S1 · GNB
//  Variants: A (GA 심플 top-nav)
// ============================================================

export interface GNBSection extends SectionBase {
  type: "gnb";
  variant: "A";
  logo: Image;
  /** 메뉴 — 최대 6개 권장 */
  menus: { label: string; href: string }[];
  /** 우측 CTA (선택) */
  cta?: CTA;
  sticky: boolean;
  /** 스크롤 시 투명→솔리드 전환 */
  transparentOnTop?: boolean;
}

// ============================================================
//  S2 · Hero
//  Variants: split (좌폼+우일러), full (full-bleed), stacked
// ============================================================

export type HeroVariant = "split" | "full" | "stacked";

export interface HeroSection extends SectionBase {
  type: "hero";
  variant: HeroVariant;
  /** 헤드라인 — 1~3 줄 */
  headline: string;
  subheadline?: string;
  visual: {
    type: "photo" | "illust" | "lottie" | "none";
    image?: Image;
    /** Lottie URL (variant=lottie) */
    lottieSrc?: string;
  };
  /** Hero에 직접 표시되는 CTA (variant=full/stacked) */
  primaryCTA?: CTA;
  /** variant=split 시 우측 일러 위/아래 텍스트 보조 라벨 */
  badge?: string;
  /** 배경 그라데이션 토큰 (디자인 토큰 키) */
  bgGradient?: "purple-soft" | "blue-soft" | "amber-soft" | "neutral";
}

// ============================================================
//  S3 · Lead Form (Hero 인접형)
//  Variants: as-hero (split 우측), inline-dark (본문 중단), right-sticky
// ============================================================

export type LeadFormVariant = "as-hero" | "inline-dark" | "right-sticky";

export type LeadFormFieldKey = "name" | "phone" | "birthdate" | "gender" | "email";
export type LeadFormFieldType = "text" | "tel" | "date" | "toggle" | "select";

export interface LeadFormField {
  key: LeadFormFieldKey;
  label: string;
  type: LeadFormFieldType;
  required: boolean;
  placeholder?: string;
  /** type=toggle/select 시 옵션 */
  options?: { label: string; value: string }[];
}

export interface LeadFormConsent {
  /** "전체 동의" 또는 "개인정보 수집·이용" 등 */
  label: string;
  required: boolean;
  /** 약관 전문 링크 */
  href?: string;
}

export interface LeadFormSection extends SectionBase {
  type: "lead-form";
  variant: LeadFormVariant;
  /** 폼 섹션 헤드라인 (variant=inline-dark에서 강조) */
  headline?: string;
  subheadline?: string;
  /** 4~5 필드 권장. 6개 이상 비권장 */
  fields: LeadFormField[];
  consents: LeadFormConsent[];
  ctaLabel: string;
  /** Formspree 또는 자체 endpoint */
  endpoint: string;
  /** 제출 후 노출 메시지 */
  successMessage?: string;
}

// ============================================================
//  S4 · Lead Form Bottom (본문 중단형, 다크)
//  S3와 통합 가능 (variant="inline-dark") — 본 schema는 별도 type 유지하여 페이지 위치 명시
// ============================================================

export interface LeadFormBottomSection extends SectionBase {
  type: "lead-form-bottom";
  variant: "A";
  headline: string;
  /** "▽" 화살표 노출 여부 */
  showScrollHint?: boolean;
  fields: LeadFormField[];
  consents: LeadFormConsent[];
  ctaLabel: string;
  endpoint: string;
}

// ============================================================
//  S5 · Metrics (Why Us / 수치카드)
//  Variants: A-3to4 (GA 3~4 핵심 지표)
// ============================================================

export interface MetricItem {
  /** 큰 숫자 텍스트 — "2,300+", "92%", "2분" */
  value: string;
  label: string;
  /** "2025.03 기준" — 법적 근거 */
  baseDate: string;
  /** Lucide icon name */
  iconKey?: string;
}

export interface MetricsSection extends SectionBase {
  type: "metrics";
  variant: "A-3to4";
  headline?: string;
  subheadline?: string;
  /** 3~4개 권장 */
  metrics: MetricItem[];
  bgTone?: "white" | "tint" | "dark";
}

// ============================================================
//  S6 · Product Cards Grid
//  Variants: 3col-illust (메리츠), 5col-symbol (굿리치), dual-cta (캐롯)
// ============================================================

export type ProductCardsVariant = "3col-illust" | "5col-symbol" | "dual-cta";

export interface ProductCard {
  title: string;
  /** 질문형 카피 ("암 진단 후 바로 보장받을 수 있을까요?") */
  headline: string;
  /** Lucide icon name 또는 자체 illustration key */
  iconKey: string;
  /** dual-cta variant 시 second CTA */
  primaryCTA: CTA;
  secondaryCTA?: CTA;
  /** 변형: bg 톤 (variant=3col-illust 한정) */
  bgTone?: "soft-purple" | "soft-blue" | "soft-green" | "soft-amber" | "soft-pink";
}

export interface ProductCardsSection extends SectionBase {
  type: "product-cards";
  variant: ProductCardsVariant;
  headline?: string;
  cards: ProductCard[];
}

// ============================================================
//  S7 · Logo Wall (협력사 로고월 — 메타리치 패턴)
//  Variants: separated (생·손 분리)
// ============================================================

export interface LogoGroup {
  /** 그룹 라벨 */
  label: "생명보험" | "손해보험" | "기타";
  logos: Image[];
}

export interface LogoWallSection extends SectionBase {
  type: "logo-wall";
  variant: "separated";
  headline?: string;
  /** 다크블루 배경 권장 */
  bgTone?: "dark-blue" | "white";
  groups: LogoGroup[];
}

// ============================================================
//  S8 · Step Flow (절차 프로세스)
//  Variants: horizontal-3
// ============================================================

export interface StepItem {
  /** 단계 번호 */
  index: number;
  title: string;
  /** 15자 이내 권장 */
  description: string;
  iconKey?: string;
}

export interface StepFlowSection extends SectionBase {
  type: "step-flow";
  variant: "horizontal-3" | "horizontal-4";
  headline?: string;
  steps: StepItem[];
}

// ============================================================
//  S9 · Consultant (상담사·전문가 소개)
//  Variants: single-photo (메타리치)
// ============================================================

export interface ConsultantSection extends SectionBase {
  type: "consultant";
  variant: "single-photo";
  /** 슬로건 — "당신만의 보험 설계자" */
  slogan: string;
  /** 상담사 사진 — 초상권 계약 필수 */
  photo: Image;
  /** 이름 (성만 노출 권장) */
  consultantName?: string;
  /** 자격·경력 — 5개 이내 권장 */
  credentials?: string[];
  cta?: CTA;
}

// ============================================================
//  S10 · Data Chart (데이터 교육·통계)
//  Variants: svg-line (굿리치 꺾은선)
// ============================================================

export interface ChartPoint {
  /** x축 라벨 */
  label: string;
  value: number;
}

export interface DataChartSection extends SectionBase {
  type: "data-chart";
  variant: "svg-line" | "svg-bar";
  headline: string;
  /** "2023-2025 자체 집계" 등 출처 — 법적 근거 필수 */
  source: string;
  points: ChartPoint[];
  /** 단일 라인 컬러 — 디자인 토큰 키 */
  lineColor?: "primary" | "accent" | "amber";
  bgTone?: "white" | "dark";
}

// ============================================================
//  S11 · Compare Cards (상품 비교)
//  Variants: masked-initial (키움 D/K/H)
// ============================================================

export interface CompareCard {
  /** "D손해보험" 같은 이니셜 (실 보험사명 노출 금지) */
  insurerCode: string;
  /** "***,***원" 마스킹 텍스트 (실가격 노출 금지) */
  priceMasked: string;
  /** 특약·보장 — 모든 카드 동일 수 권장 */
  features: string[];
  /** "자세히보기" → 상담 폼 연결 */
  detailCTA: CTA;
}

export interface CompareCardsSection extends SectionBase {
  type: "compare-cards";
  variant: "masked-initial";
  headline: string;
  /** "30세 남성·1억원 기준" 비교 조건 명시 — 법적 필수 */
  conditionLabel: string;
  cards: CompareCard[];
}

// ============================================================
//  S12 · Persona Cards (추천 대상)
//  Variants: 3to4-illust (메리츠)
// ============================================================

export interface PersonaCard {
  /** "30~40대 직장인" */
  audience: string;
  /** 1줄 카피 */
  copy: string;
  iconKey: string;
  cta?: CTA;
  bgTone?: "soft-purple" | "soft-blue" | "soft-green" | "soft-amber";
}

export interface PersonaSection extends SectionBase {
  type: "persona";
  variant: "3to4-illust";
  headline: string;
  cards: PersonaCard[];
}

// ============================================================
//  S13 · FAQ (아코디언)
//  Variants: line-accordion
// ============================================================

export interface FAQItem {
  question: string;
  answer: string;
  /** 기본 펼침 여부 */
  defaultOpen?: boolean;
}

export interface FAQSection extends SectionBase {
  type: "faq";
  variant: "line-accordion";
  headline?: string;
  items: FAQItem[];
}

// ============================================================
//  S14 · Testimonial (후기)
//  Variants: masked
// ============================================================

export interface TestimonialItem {
  /** 마스킹된 닉네임 — "김** / 30대 직장인" */
  nicknameMasked: string;
  /** 1~2문장 후기 */
  quote: string;
  /** 별점 (1-5) — 4.5~5만 모으지 말고 다양화 */
  rating?: number;
  /** 후기 카테고리 — "가입 경험" / "보장 만족" 등 */
  category?: string;
}

export interface TestimonialSection extends SectionBase {
  type: "testimonial";
  variant: "masked";
  headline?: string;
  items: TestimonialItem[];
}

// ============================================================
//  S15 · Sticky CTA Bar
//  Variants: floating-2btn (메리츠), bottom-bar (삼성)
// ============================================================

export type StickyCTAVariant = "floating-2btn" | "bottom-bar";

export interface StickyCTASection extends SectionBase {
  type: "sticky-cta";
  variant: StickyCTAVariant;
  /** 1~2버튼 */
  buttons: { label: string; href: string; iconKey: "phone" | "chat" | "calendar" | "search" }[];
  /** 모바일에서 스크롤 시 숨김 처리 */
  hideOnScroll?: boolean;
}

// ============================================================
//  S16 · Footer
//  Variants: red-warning (메타리치 준법), minimal-light (굿리치)
// ============================================================

export type FooterVariant = "red-warning" | "minimal-light";

export interface FooterBusinessInfo {
  name: string;
  ceo: string;
  address: string;
  /** 사업자등록번호 */
  bizRegNo: string;
  /** 통신판매신고번호 */
  telesalesNo: string;
  /** 보험판매대리점 등록번호 (해당 시) */
  insAgencyNo?: string;
  phone: string;
  email: string;
  fax?: string;
}

export interface FooterSection extends SectionBase {
  type: "footer";
  variant: FooterVariant;
  business: FooterBusinessInfo;
  /** 준법 문구 블록 — 레드 강조 가능 */
  compliance: string[];
  /** 풋터 링크 (이용약관·개인정보처리방침 등) */
  links: { label: string; href: string }[];
  /** SNS 아이콘 (선택, 5개 이내) */
  snsLinks?: {
    type: "youtube" | "instagram" | "facebook" | "blog" | "kakao";
    href: string;
  }[];
  /** 카피라이트 텍스트 */
  copyright: string;
}

// ============================================================
//  UNION & PAGE-LEVEL
// ============================================================

/** 모든 섹션 인스턴스의 합집합 — Page.sections[] 의 타입 */
export type SectionInstance =
  | GNBSection
  | HeroSection
  | LeadFormSection
  | LeadFormBottomSection
  | MetricsSection
  | ProductCardsSection
  | LogoWallSection
  | StepFlowSection
  | ConsultantSection
  | DataChartSection
  | CompareCardsSection
  | PersonaSection
  | FAQSection
  | TestimonialSection
  | StickyCTASection
  | FooterSection;

/** 한 클라이언트 랜딩 페이지의 최상위 데이터 */
export interface LandingPage {
  /** 클라이언트 식별 */
  clientId: string;
  /** 페이지 슬러그 */
  slug: string;
  /** SEO 타이틀 */
  title: string;
  /** SEO 디스크립션 */
  description?: string;
  /** 페이지 OG 이미지 */
  ogImage?: Image;
  /** 사용된 컬러·폰트 토큰 키 (디자인 시스템 06 매핑) */
  themeKey?: string;
  /** 섹션 인스턴스 배열 — order 오름차순 정렬 */
  sections: SectionInstance[];
}

// ============================================================
//  VARIANT REGISTRY (Layer 3 매핑 단서)
// ============================================================

/**
 * Figma 컴포넌트 ↔ 코드 컴포넌트 매핑 매니페스트.
 * 코드 generation/sync 시 단일 진실원으로 사용.
 */
export const FIGMA_COMPONENT_MANIFEST = [
  { type: "gnb",              variant: "A",              figma: "mp/section/gnb/A" },
  { type: "hero",             variant: "split",          figma: "mp/section/hero/split" },
  { type: "hero",             variant: "full",           figma: "mp/section/hero/full" },
  { type: "hero",             variant: "stacked",        figma: "mp/section/hero/stacked" },
  { type: "lead-form",        variant: "as-hero",        figma: "mp/section/lead-form/as-hero" },
  { type: "lead-form",        variant: "inline-dark",    figma: "mp/section/lead-form/inline-dark" },
  { type: "lead-form",        variant: "right-sticky",   figma: "mp/section/lead-form/right-sticky" },
  { type: "lead-form-bottom", variant: "A",              figma: "mp/section/lead-form-bottom/A" },
  { type: "metrics",          variant: "A-3to4",         figma: "mp/section/metrics/A-3to4" },
  { type: "product-cards",    variant: "3col-illust",    figma: "mp/section/product-cards/3col-illust" },
  { type: "product-cards",    variant: "5col-symbol",    figma: "mp/section/product-cards/5col-symbol" },
  { type: "product-cards",    variant: "dual-cta",       figma: "mp/section/product-cards/dual-cta" },
  { type: "logo-wall",        variant: "separated",      figma: "mp/section/logo-wall/separated" },
  { type: "step-flow",        variant: "horizontal-3",   figma: "mp/section/step-flow/horizontal-3" },
  { type: "consultant",       variant: "single-photo",   figma: "mp/section/consultant/single-photo" },
  { type: "data-chart",       variant: "svg-line",       figma: "mp/section/data-chart/svg-line" },
  { type: "compare-cards",    variant: "masked-initial", figma: "mp/section/compare-cards/masked-initial" },
  { type: "persona",          variant: "3to4-illust",    figma: "mp/section/persona/3to4-illust" },
  { type: "faq",              variant: "line-accordion", figma: "mp/section/faq/line-accordion" },
  { type: "testimonial",      variant: "masked",         figma: "mp/section/testimonial/masked" },
  { type: "sticky-cta",       variant: "floating-2btn",  figma: "mp/section/sticky-cta/floating-2btn" },
  { type: "sticky-cta",       variant: "bottom-bar",     figma: "mp/section/sticky-cta/bottom-bar" },
  { type: "footer",           variant: "red-warning",    figma: "mp/section/footer/red-warning" },
  { type: "footer",           variant: "minimal-light",  figma: "mp/section/footer/minimal-light" },
] as const;

export type FigmaComponentName = typeof FIGMA_COMPONENT_MANIFEST[number]["figma"];

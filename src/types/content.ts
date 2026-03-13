/** Bilingual field */
export type Bi = { fr: string; en: string };

// ─── Hero ──────────────────────────────────────────
export interface HeroContent {
  badgeText: string;
  title: Bi;
  titleAccent: Bi;
  subtitle: Bi;
  ctaPrimary: Bi;
  ctaSecondary: Bi;
}

// ─── Stats ─────────────────────────────────────────
export interface StatItem {
  value: string;
  label: Bi;
}

// ─── Nav ───────────────────────────────────────────
export interface NavLink { label: Bi; href: string }
export interface NavContent {
  links: NavLink[];
  ctaLabel: Bi;
}

// ─── TrustBar ──────────────────────────────────────
export interface TrustBarClient { name: string; abbr: string; color: string }
export interface TrustBarContent {
  label: Bi;
  clients: TrustBarClient[];
}

// ─── HowItWorks ────────────────────────────────────
export interface HowItWorksStep { iconName: string; title: Bi; desc: Bi }
export interface HowItWorksContent {
  badge: Bi;
  title: Bi;
  subtitle: Bi;
  steps: HowItWorksStep[];
}

// ─── Services ──────────────────────────────────────
export interface ServiceItem {
  id: string;
  iconName: string;
  title: Bi;
  subtitle: Bi;
  desc: Bi;
  tags: Bi;
  price: Bi;
  popular: boolean;
}

export interface SubServiceItem {
  name: Bi;
  price: Bi;
  credits?: number;
  desc: Bi;
  deliverables: Bi[];
  timeline: Bi;
}

export interface ServicePhase { name: Bi; duration: Bi; desc: Bi }

export interface ServiceDetailItem {
  extendedDesc: Bi;
  differentiator: Bi;
  phases: ServicePhase[];
  deliverables: Bi[];
  timeline: Bi;
  idealFor: Bi[];
  subServices: SubServiceItem[];
}

export interface ServicesContent {
  badge: Bi;
  title: Bi;
  subtitle: Bi;
  items: ServiceItem[];
  details: Record<string, ServiceDetailItem>;
}

// ─── Marketplace ───────────────────────────────────
export interface MarketplaceItem {
  id: string;
  name: string;
  tagline: Bi;
  desc: Bi;
  features: Bi;
  tier: string;
  badgeCls: string;
  price?: Bi;
  forgeDiscount?: string;
}

export interface MarketplaceBenefit { title: Bi; desc: Bi }

export interface MarketplaceDetailItem {
  extendedDesc: Bi;
  keyBenefits: MarketplaceBenefit[];
  integrations: string[];
  availability: Bi;
}

export interface MarketplaceContent {
  badge: Bi;
  title: string;
  subtitle: Bi;
  items: MarketplaceItem[];
  details: Record<string, MarketplaceDetailItem>;
}

// ─── Case Studies ──────────────────────────────────
export interface CaseStudyResult { metric: Bi; label: Bi }
export interface CaseStudyItem {
  client: string;
  sector: Bi;
  title: Bi;
  challenge: Bi;
  solution: Bi;
  results: CaseStudyResult[];
  service: Bi;
  color: string;
}
export interface CaseStudiesContent {
  badge: Bi;
  title: Bi;
  subtitle: Bi;
  items: CaseStudyItem[];
}

// ─── Testimonials ──────────────────────────────────
export interface TestimonialItem {
  name: string;
  role: Bi;
  company: string;
  quote: Bi;
}
export interface TestimonialsContent {
  badge: Bi;
  title: Bi;
  subtitle: Bi;
  items: TestimonialItem[];
}

// ─── Comparison ────────────────────────────────────
export interface ComparisonRow {
  label: Bi;
  traditional: Bi | boolean;
  forge: Bi | boolean;
}
export interface ComparisonContent {
  badge: Bi;
  title: Bi;
  subtitle: Bi;
  traditionalLabel: Bi;
  forgeLabel: string;
  rows: ComparisonRow[];
}

// ─── AI Chat ───────────────────────────────────────
export interface ChatExchange { user: string; assistant: string }
export interface ChatScenario {
  key: string;
  iconName: string;
  label: Bi;
  exchanges: { fr: ChatExchange[]; en: ChatExchange[] };
}
export interface AIChatFeature { iconName: string; text: Bi }
export interface AIChatContent {
  badge: string;
  title: Bi;
  subtitle: Bi;
  features: AIChatFeature[];
  scenarios: ChatScenario[];
}

// ─── Pricing ───────────────────────────────────────
export interface PlanItem {
  name: string;
  price: Bi;
  sub: Bi;
  features: Bi[];
  cta: Bi;
  highlight: boolean;
}
export interface PricingContent {
  badge: Bi;
  title: Bi;
  subtitle: Bi;
  plans: PlanItem[];
}

// ─── FAQ ───────────────────────────────────────────
export interface FAQItem { q: Bi; a: Bi }
export interface FAQContent {
  badge: string;
  title: Bi;
  subtitle: Bi;
  items: FAQItem[];
}

// ─── Contact ───────────────────────────────────────
export interface ContactInfoItem { iconName: string; text: Bi }
export interface ContactContent {
  badge: Bi;
  title: Bi;
  subtitle: Bi;
  contactInfo: ContactInfoItem[];
  formLabels: {
    name: Bi; email: Bi; company: Bi; companyPlaceholder: Bi;
    message: Bi; messagePlaceholder: Bi; submit: Bi;
    sending: Bi; success: Bi; successSub: Bi; note: Bi;
  };
}

// ─── CTA Banner ────────────────────────────────────
export interface CTABannerContent {
  title: Bi;
  subtitle: Bi;
  ctaPrimary: Bi;
  ctaSecondary: Bi;
}

// ─── Footer ────────────────────────────────────────
export interface FooterColumn { title: Bi; links: Bi[] }
export interface FooterContent {
  tagline: Bi;
  columns: FooterColumn[];
  bottomLinks: Bi[];
  copyright: Bi;
}

// ─── Master type ───────────────────────────────────
export interface SiteContent {
  hero: HeroContent;
  stats: StatItem[];
  nav: NavContent;
  trustbar: TrustBarContent;
  howItWorks: HowItWorksContent;
  services: ServicesContent;
  marketplace: MarketplaceContent;
  caseStudies: CaseStudiesContent;
  testimonials: TestimonialsContent;
  comparison: ComparisonContent;
  aiChat: AIChatContent;
  pricing: PricingContent;
  faq: FAQContent;
  contact: ContactContent;
  ctaBanner: CTABannerContent;
  footer: FooterContent;
}

export type SectionKey = keyof SiteContent;

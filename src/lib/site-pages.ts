/**
 * The built-in pages that ship with the site: About, How It Works, Built For You and the three
 * legal pages.
 *
 * Each one has a dedicated URL and a row in the `pages` collection keyed by `slug`. The copy below
 * is the default the site falls back to while that row does not exist, and it is also what
 * Admin → Site Pages pre-fills the editor with, so an admin always starts from real content
 * instead of an empty form.
 *
 * Adding an entry here is all it takes to make a new fixed page editable — the admin screen, the
 * public loader and the item renderers are all driven from this list.
 */

/** How a page renders the structured cards stored in its `items` field. */
export type SitePageLayout = "legal" | "steps" | "features" | "checklist";

/** `items` for a "legal" page: the stacked blocks that `LegalContent` renders. */
export type LegalItem = { heading: string; paragraphs: string[]; bullets?: string[] };
/** `items` for a "steps" page: the numbered How It Works cards. */
export type StepItem = { title: string; body: string };
/** `items` for a "features" page: the icon cards. `icon` names an entry in `FEATURE_ICONS`. */
export type FeatureItem = { icon: string; title: string; body: string };

export type SitePageDef = {
  /** `pages.slug` — also the key the admin screen and public loaders look the row up by. */
  slug: string;
  /** The dedicated URL. Every one of these has a static route, so `/$slug` never sees it. */
  path: string;
  /** Label used in the admin list and in the "read more" link on the homepage. */
  navLabel: string;
  layout: SitePageLayout;
  /** Homepage section slug in `homepage_sections`, when this page also appears on the homepage. */
  sectionSlug?: string;
  /** One-line note shown in the admin list, explaining where this page shows up. */
  adminHint: string;
  defaults: {
    eyebrow: string;
    title: string;
    short_description: string;
    /** Search/social copy, which is usually worded differently from the on-page intro. */
    seo_title: string;
    seo_description: string;
    content: string;
    items: LegalItem[] | StepItem[] | FeatureItem[] | string[];
  };
};

export const SITE_PAGES: SitePageDef[] = [
  {
    slug: "about",
    path: "/about",
    navLabel: "About",
    layout: "checklist",
    sectionSlug: "about",
    adminHint: "Linked from the About section on the homepage and from the header.",
    defaults: {
      eyebrow: "About",
      title: "Premium entertainment, honestly presented",
      short_description:
        "Strike Arena was designed around clarity: real descriptions, generous spacing and a layout that behaves the same on a phone as it does on a desktop.",
      seo_title: "About Us — Our Approach | Strike Arena",
      seo_description:
        "Learn how Strike Arena approaches sports entertainment, online gaming, user-friendly design, support, mobile accessibility and responsible gaming.",
      content: "",
      items: [
        "Sports entertainment organised by competition and fixture",
        "Online gaming categories with consistent, readable card layouts",
        "User-friendly design with generous spacing and clear hierarchy",
        "Customer support through the channels published on this site",
        "Mobile accessibility from small phones to large desktops",
        "Responsible gaming guidance available on every page",
      ],
    },
  },
  {
    slug: "how-it-works",
    path: "/how-it-works",
    navLabel: "How It Works",
    layout: "steps",
    sectionSlug: "how_it_works",
    adminHint: "Linked from the How It Works section on the homepage and the About page.",
    defaults: {
      eyebrow: "How It Works",
      title: "Three steps to get going",
      short_description: "A short, transparent path from registration to responsible play.",
      seo_title: "How It Works — Three Simple Steps | Strike Arena",
      seo_description:
        "How Strike Arena works, from creating an account to exploring the sports and gaming categories and playing responsibly.",
      content: "",
      items: [
        {
          title: "Create an Account",
          body: "Register with your details where the service is legally available, and confirm you meet the age and eligibility rules.",
        },
        {
          title: "Explore Available Games",
          body: "Browse the sports hub and the gaming grid, then open any category to see what it offers.",
        },
        {
          title: "Enjoy Responsibly",
          body: "Set your own limits, treat every session as entertainment, and reach support whenever you need help.",
        },
      ],
    },
  },
  {
    slug: "built-for-you",
    path: "/built-for-you",
    navLabel: "Built For You",
    layout: "features",
    sectionSlug: "why_us",
    adminHint: "Linked from the Built For You section on the homepage and the About page.",
    defaults: {
      eyebrow: "Built For You",
      title: "Designed around the details that matter",
      short_description:
        "Four principles shape every screen on the platform, from the first tap to the last.",
      seo_title: "Built For You — Our Design Principles | Strike Arena",
      seo_description:
        "The four principles behind every Strike Arena screen: a fast experience, mobile-friendly layouts, reachable support and responsible gaming.",
      content: "",
      items: [
        {
          icon: "gauge",
          title: "Fast Experience",
          body: "A clean and responsive interface designed for smooth navigation.",
        },
        {
          icon: "smartphone",
          title: "Mobile Friendly",
          body: "A seamless experience across smartphones, tablets and desktop devices.",
        },
        {
          icon: "headset",
          title: "Customer Support",
          body: "Easy access to customer assistance through available support channels.",
        },
        {
          icon: "shield",
          title: "Responsible Gaming",
          body: "Promote responsible and informed participation.",
        },
      ],
    },
  },
  {
    slug: "terms",
    path: "/terms",
    navLabel: "Terms & Conditions",
    layout: "legal",
    adminHint: "Linked from the Legal column in the footer.",
    defaults: {
      eyebrow: "Terms & Conditions",
      title: "The rules of using this site",
      short_description:
        "Eligibility, acceptable use and the limits of what this website provides, written to be readable.",
      seo_title: "Terms & Conditions | Strike Arena",
      seo_description:
        "The terms that govern use of the Strike Arena website, including eligibility, acceptable use, availability and limits of liability.",
      content: "",
      items: [
        {
          heading: "Acceptance of these terms",
          paragraphs: [
            "By using this website you agree to these terms. If you do not agree with any part of them, please stop using the site.",
          ],
        },
        {
          heading: "Eligibility",
          paragraphs: [
            "You must be an adult of legal age in your jurisdiction and located somewhere this service is legally permitted. You are responsible for knowing and following the laws that apply to you.",
          ],
        },
        {
          heading: "Acceptable use",
          paragraphs: ["When using this website you agree not to:"],
          bullets: [
            "Provide false, misleading or third-party information during registration or contact.",
            "Attempt to disrupt, probe or gain unauthorised access to the site or its systems.",
            "Copy, resell or republish site content, branding or design without written permission.",
            "Use the site on behalf of anyone who is restricted from accessing it.",
          ],
        },
        {
          heading: "Availability and content",
          paragraphs: [
            "Features, categories and pages may change, be limited by region, or be withdrawn. Content on this site is provided for general information and entertainment; it is not advice and it makes no promise of any particular outcome.",
            "Any real-money gambling, payments, account systems, odds or promotional features are offered only where legally permitted and appropriately licensed.",
          ],
        },
        {
          heading: "Intellectual property",
          paragraphs: [
            "The Strike Arena name, logo, copy, layout and visual identity are original works belonging to the operator of this website and may not be used without permission.",
          ],
        },
        {
          heading: "Limitation of liability",
          paragraphs: [
            "To the fullest extent permitted by law, the operator is not liable for indirect or consequential loss arising from use of this website, including interruptions, inaccuracies or unavailability of any feature.",
          ],
        },
        {
          heading: "Changes and contact",
          paragraphs: [
            "These terms may be updated from time to time; the version published here is the current one. For questions, use the contact form or the WhatsApp support button.",
          ],
        },
      ],
    },
  },
  {
    slug: "privacy-policy",
    path: "/privacy-policy",
    navLabel: "Privacy Policy",
    layout: "legal",
    adminHint: "Linked from the Legal column in the footer.",
    defaults: {
      eyebrow: "Privacy Policy",
      title: "Your information, handled carefully",
      short_description:
        "A plain-language summary of what we collect through this website and how it is used.",
      seo_title: "Privacy Policy | Strike Arena",
      seo_description:
        "How Strike Arena handles the information you submit through the contact form, including what is collected, why, and how to request changes.",
      content: "",
      items: [
        {
          heading: "What this policy covers",
          paragraphs: [
            "This policy explains how information submitted through this website is handled. It applies to the contact form and to messages you start through the published WhatsApp support channel.",
          ],
        },
        {
          heading: "Information we collect",
          paragraphs: ["We only collect what you choose to send us:"],
          bullets: [
            "Your name, email address and optional phone number.",
            "The content of the message you submit.",
            "Basic technical information your browser sends with any web request.",
          ],
        },
        {
          heading: "How it is used",
          paragraphs: [
            "Contact details are used to answer your question and to keep a record of the conversation. We do not sell your information, and we do not use it for unrelated marketing without your consent.",
          ],
        },
        {
          heading: "Retention and security",
          paragraphs: [
            "Messages are kept only as long as needed to handle your request or to meet legal obligations. Reasonable technical and organisational measures are used to protect information in transit and at rest, though no method of transmission is completely secure.",
          ],
        },
        {
          heading: "Your choices",
          paragraphs: [
            "You can ask us to correct or delete the details you have sent by contacting support. Please avoid sending sensitive information such as identity documents or payment data through the contact form.",
          ],
        },
      ],
    },
  },
  {
    slug: "responsible-gaming",
    path: "/responsible-gaming",
    navLabel: "Responsible Gaming",
    layout: "legal",
    adminHint: "Linked from the Legal column in the footer.",
    defaults: {
      eyebrow: "Responsible Gaming",
      title: "Stay in control, always",
      short_description:
        "Clear guidance on keeping participation informed, proportionate and enjoyable — plus how to get help if it stops being fun.",
      seo_title: "Responsible Gaming — Stay In Control | Strike Arena",
      seo_description:
        "Responsible gaming information from Strike Arena: age and eligibility rules, limit setting, warning signs and where to find independent support.",
      content: "",
      items: [
        {
          heading: "Entertainment first",
          paragraphs: [
            "Gaming and sports entertainment should stay enjoyable. It is not a way to earn an income, recover losses or solve financial pressure, and outcomes can never be guaranteed.",
          ],
        },
        {
          heading: "Age and eligibility",
          paragraphs: [
            "Access is restricted to adults who meet the minimum legal age in their jurisdiction, which is 18 or higher depending on local law. Features are made available only where they are legally permitted and appropriately licensed.",
          ],
        },
        {
          heading: "Practical habits",
          paragraphs: ["A few simple habits keep participation in proportion:"],
          bullets: [
            "Decide your time and spending limits before you start.",
            "Treat any amount you use as the cost of entertainment.",
            "Take regular breaks and avoid long, unbroken sessions.",
            "Never participate while stressed, upset or under the influence.",
            "Do not try to win back money you have already used.",
          ],
        },
        {
          heading: "Signs to watch for",
          paragraphs: [
            "Consider pausing if you are spending more time or money than planned, hiding your activity from people close to you, borrowing to continue, or feeling anxious when you cannot participate.",
          ],
        },
        {
          heading: "Tools and support",
          paragraphs: [
            "Our support team can explain the limit, cool-off and self-exclusion options available in your region, and can point you toward independent, confidential help services. Contact us through the form or the WhatsApp button on any page.",
          ],
        },
      ],
    },
  },
];

export const sitePageDef = (slug: string): SitePageDef | null =>
  SITE_PAGES.find((p) => p.slug === slug) ?? null;

/** The slugs the public loader fetches in one go. */
export const SITE_PAGE_SLUGS = SITE_PAGES.map((p) => p.slug);

// ---------------------------------------------------------------------------
// Item parsing
//
// `items` is edited as raw JSON in the admin, so every reader has to cope with a shape that does
// not match. Each parser returns `null` for an unusable value, and callers then fall back to the
// defaults above rather than rendering an empty section.
// ---------------------------------------------------------------------------

const str = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

const strList = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(str).filter(Boolean) : [];

function parseList<T>(value: unknown, one: (entry: unknown) => T | null): T[] | null {
  if (!Array.isArray(value)) return null;
  const parsed = value.map(one).filter((entry): entry is T => entry !== null);
  return parsed.length > 0 ? parsed : null;
}

export const parseLegalItems = (value: unknown): LegalItem[] | null =>
  parseList<LegalItem>(value, (entry) => {
    const row = entry as { heading?: unknown; paragraphs?: unknown; bullets?: unknown };
    const heading = str(row?.heading);
    if (!heading) return null;
    const bullets = strList(row?.bullets);
    return {
      heading,
      paragraphs: strList(row?.paragraphs),
      ...(bullets.length > 0 ? { bullets } : {}),
    };
  });

export const parseStepItems = (value: unknown): StepItem[] | null =>
  parseList<StepItem>(value, (entry) => {
    const row = entry as { title?: unknown; body?: unknown };
    const title = str(row?.title);
    return title ? { title, body: str(row?.body) } : null;
  });

export const parseFeatureItems = (value: unknown): FeatureItem[] | null =>
  parseList<FeatureItem>(value, (entry) => {
    const row = entry as { icon?: unknown; title?: unknown; body?: unknown };
    const title = str(row?.title);
    return title ? { icon: str(row?.icon), title, body: str(row?.body) } : null;
  });

/** Checklist entries may be written as plain strings or as `{ "text": "..." }` objects. */
export const parseChecklistItems = (value: unknown): string[] | null =>
  parseList<string>(value, (entry) => {
    if (typeof entry === "string") return str(entry) || null;
    const text = str((entry as { text?: unknown })?.text);
    return text || null;
  });

// ---------------------------------------------------------------------------
// Resolution
// ---------------------------------------------------------------------------

/**
 * Merges the CMS row for a built-in page over its defaults, field by field.
 *
 * A blank field in the admin means "use the built-in copy" rather than "show nothing", so an
 * admin who only wants to reword the heading does not have to retype the whole page.
 */
export function resolveSitePage(def: SitePageDef, row: SitePageRow | null) {
  const pick = (value: unknown, fallback: string) =>
    typeof value === "string" && value.trim() ? value : fallback;

  return {
    def,
    eyebrow: pick(row?.eyebrow, def.defaults.eyebrow),
    title: pick(row?.title, def.defaults.title),
    description: pick(row?.short_description, def.defaults.short_description),
    content: pick(row?.content, def.defaults.content),
    backgroundImage: row?.background_image ?? null,
    backgroundImageMobile: row?.background_image_mobile ?? null,
    image: row?.featured_image ?? null,
    imageMobile: row?.featured_image_mobile ?? null,
    seoTitle: pick(row?.seo_title, def.defaults.seo_title),
    seoDescription: pick(row?.seo_description, def.defaults.seo_description),
    seoImage: row?.seo_image ?? null,
    /** Raw, still unparsed — each renderer runs the parser for its own layout. */
    items: row?.items ?? def.defaults.items,
  };
}

/** The subset of `PageRow` a built-in page reads. Kept structural so callers can pass a raw row. */
export type SitePageRow = {
  eyebrow?: string | null;
  title?: string | null;
  short_description?: string | null;
  content?: string | null;
  background_image?: string | null;
  background_image_mobile?: string | null;
  featured_image?: string | null;
  featured_image_mobile?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_image?: string | null;
  items?: unknown;
};

/**
 * `<head>` tags for a built-in page, built from the CMS row where one exists.
 *
 * Kept here rather than in each route file so the six routes stay identical apart from the slug.
 */
export function sitePageHead(def: SitePageDef, row: SitePageRow | null) {
  const page = resolveSitePage(def, row);
  const title = page.seoTitle || `${page.title} | Strike Arena`;

  const description = page.seoDescription;
  const image = page.seoImage || page.backgroundImage;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: def.path },
      ...(image ? [{ property: "og:image", content: image }] : []),
    ],
    links: [{ rel: "canonical", href: def.path }],
  };
}

/**
 * Initial content.
 *
 * Ported from the Supabase migration `supabase/migrations/20260809083706_*.sql` (the `seed data`
 * section) so a fresh MongoDB database reproduces exactly what the Postgres schema shipped with,
 * plus the records needed by features that were previously dead ends (CMS pages for the seeded
 * /cricket, /football and /tennis nav links, and demo promotions/screenshots/available sites).
 *
 * Everything here is upserted by a natural key (`slug`, `path`, or the settings `_id`), so
 * `npm run seed` is safe to run repeatedly and will not duplicate rows.
 */

export const SITE_SETTINGS = {
  site_name: "Strike Arena",
  tagline: "Sports and gaming entertainment",
  description: "A modern sports and gaming entertainment platform.",
  logo_url: null,
  favicon_url: null,
  whatsapp_url: "https://wa.me/000000000000",
  email: null,
  phone: null,
  social_links: [],
  copyright_text: "© Strike Arena. All rights reserved.",
};

export const THEME_SETTINGS = {
  primary_color: "#f0b429",
  secondary_color: "#7c3aed",
  accent_color: "#22c55e",
  button_color: "#f0b429",
  button_text_color: "#140f02",
  header_color: "#120d1f",
  footer_color: "#100b1a",
  card_color: "#1a1330",
  background_color: "#0f0a1c",
  text_color: "#f5f3ff",
  heading_color: "#ffffff",
  font_family: "Manrope",
  heading_font: "Sora",
  body_font: "Manrope",
  border_radius: "1rem",
  button_style: "rounded",
  card_style: "glass",
};

export const SUPPORT_SETTINGS = {
  whatsapp_url: "https://wa.me/000000000000",
  email: null,
  phone: null,
  live_chat_url: null,
  telegram_url: null,
  support_text: "Need help? Our team is available on WhatsApp.",
};

export const FOOTER_SETTINGS = {
  logo_url: null,
  description: "A modern sports and gaming entertainment platform.",
  footer_links: [
    { label: "Home", url: "/" },
    { label: "Sports", url: "/sports" },
    { label: "Games", url: "/games" },
    { label: "Blog", url: "/blog" },
    { label: "Contact", url: "/contact" },
  ],
  legal_links: [
    { label: "Privacy Policy", url: "/privacy-policy" },
    { label: "Terms & Conditions", url: "/terms" },
    { label: "Responsible Gaming", url: "/responsible-gaming" },
  ],
  social_links: [],
  contact_info: null,
  copyright_text: "© Strike Arena. All rights reserved.",
};

export const BACKGROUNDS = [
  { slug: "home", label: "Homepage Background" },
  { slug: "sports", label: "Sports Background" },
  { slug: "cricket", label: "Cricket Background" },
  { slug: "football", label: "Football Background" },
  { slug: "tennis", label: "Tennis Background" },
  { slug: "games", label: "Games Background" },
  { slug: "blog", label: "Blog Background" },
  { slug: "contact", label: "Contact Background" },
  { slug: "footer", label: "Footer Background" },
].map((row) => ({ ...row, image_url: null, overlay_color: "#0f0a1c", overlay_opacity: 0.65 }));

export const NAVIGATION = [
  { label: "Home", url: "/", sort_order: 1 },
  { label: "Sports", url: "/sports", sort_order: 2 },
  { label: "Cricket", url: "/cricket", sort_order: 3 },
  { label: "Football", url: "/football", sort_order: 4 },
  { label: "Tennis", url: "/tennis", sort_order: 5 },
  { label: "Games", url: "/games", sort_order: 6 },
  { label: "Blog", url: "/blog", sort_order: 7 },
  { label: "Contact", url: "/contact", sort_order: 8 },
].map((row) => ({ ...row, new_tab: false, status: "published" as const }));

export const HOMEPAGE_SECTIONS = [
  [
    "hero",
    "Hero Slider",
    "Play The Game. Feel The Action.",
    "Sports and gaming entertainment in one modern platform.",
    1,
  ],
  ["sports", "Sports Categories", "Top Sports", "Pick a sport and see what is on today.", 2],
  ["live_sports", "Live Sports", "Live Sports", "Follow live action across popular sports.", 3],
  ["how_it_works", "How It Works", "How It Works", "Three simple steps to get started.", 4],
  ["cricket", "Cricket", "Cricket", "Match pages built for cricket fans.", 5],
  ["football", "Football", "Football", "League and cup coverage in one place.", 6],
  ["tennis", "Tennis", "Tennis", "Court schedules made simple.", 7],
  ["games", "Games", "Games", "Browse popular game categories.", 8],
  [
    "screenshots",
    "Payment Screenshots",
    "Demo Screenshots",
    "Sample screens from the platform.",
    9,
  ],
  ["available_sites", "Available Sites", "Available Sites", "Demo platforms you can explore.", 10],
  [
    "platform_screenshots",
    "Platform Screenshots",
    "Platform Screens",
    "See how the platform looks.",
    11,
  ],
  ["promotions", "Promotions", "Promotions", "Current featured content.", 12],
  [
    "about",
    "About STRIKE ARENA",
    "A premium home for sports and gaming entertainment",
    "Strike Arena brings sports coverage and gaming categories together in one calm, modern interface.",
    13,
  ],
  ["why_us", "Built For You", "Built For You", "Fast, clean and mobile friendly.", 13],
  ["mobile", "Mobile Section", "Built For Mobile", "Works well on every phone.", 14],
  ["support", "Customer Support", "Need Help?", "Talk to our team on WhatsApp.", 15],
  ["faq", "FAQ", "Common Questions", "Short answers to popular questions.", 16],
  ["responsible", "Responsible Gaming", "Play Responsibly", "18+ only. Keep it fun.", 17],
  ["cta", "Final CTA", "Ready For The Next Game?", "Explore sports and games in one place.", 18],
].map(([slug, name, heading, description, sort_order]) => ({
  slug: slug as string,
  name: name as string,
  heading: heading as string,
  description: description as string,
  sort_order: sort_order as number,
  enabled: true,
  image_url: null,
  button_text: null,
  button_url: null,
}));

export const HERO_SLIDES = [
  {
    title: "Play The Game. Feel The Action.",
    description: "Sports and gaming entertainment in one modern platform.",
    button_text: "Explore Games",
    button_url: "/games",
    sort_order: 1,
  },
  {
    title: "Live Sports Every Day",
    description: "Cricket, football and tennis coverage in one place.",
    button_text: "See Cricket",
    button_url: "/cricket",
    sort_order: 2,
  },
].map((row) => ({ ...row, image_url: null, status: "published" as const }));

export const SPORTS = [
  {
    name: "Cricket",
    slug: "cricket",
    description: "Follow domestic and international cricket fixtures.",
    sort_order: 1,
  },
  {
    name: "Football",
    slug: "football",
    description: "League and cup coverage by competition.",
    sort_order: 2,
  },
  {
    name: "Tennis",
    slug: "tennis",
    description: "Court schedules across every season.",
    sort_order: 3,
  },
  {
    name: "Basketball",
    slug: "basketball",
    description: "Fast fixture lists and team pages.",
    sort_order: 4,
  },
  {
    name: "Other Sports",
    slug: "other-sports",
    description: "Badminton, hockey, table tennis and more.",
    sort_order: 5,
  },
].map((row) => ({
  ...row,
  icon: null,
  image_url: null,
  background_image: null,
  content: null,
  url: null,
  seo_title: null,
  seo_description: null,
  seo_image: null,
  status: "published" as const,
}));

export const GAMES = [
  ["Roulette", "roulette", "A classic wheel game with a simple table view.", "Table", 1],
  ["Blackjack", "blackjack", "Familiar card play with clear layouts.", "Cards", 2],
  ["Baccarat", "baccarat", "A clean, easy to follow card game.", "Cards", 3],
  ["Teen Patti", "teen-patti", "A regional favourite with a modern look.", "Cards", 4],
  ["Poker", "poker", "Table lobbies arranged for clarity.", "Cards", 5],
  ["Dragon Tiger", "dragon-tiger", "A short card game with two sides.", "Fast play", 6],
  ["Slots", "slots", "Themed reel titles by category.", "Reels", 7],
  ["Live Games", "live-games", "Studio style games in a responsive layout.", "Studio", 8],
].map(([name, slug, short_description, tag, sort_order]) => ({
  name: name as string,
  slug: slug as string,
  short_description: short_description as string,
  tag: tag as string,
  sort_order: sort_order as number,
  featured_image: null,
  background_image: null,
  content: null,
  button_text: "Learn More",
  seo_title: null,
  seo_description: null,
  seo_image: null,
  status: "published" as const,
}));

export const BLOG_CATEGORIES = [
  { name: "Cricket", slug: "cricket", sort_order: 1 },
  { name: "Football", slug: "football", sort_order: 2 },
  { name: "Tennis", slug: "tennis", sort_order: 3 },
  { name: "Sports", slug: "sports", sort_order: 4 },
  { name: "News", slug: "news", sort_order: 5 },
  { name: "Guides", slug: "guides", sort_order: 6 },
  { name: "Updates", slug: "updates", sort_order: 7 },
].map((row) => ({ ...row, description: null }));

export const FAQ_ITEMS = [
  [
    "What sports are available?",
    "Cricket, football, tennis, basketball and more. Availability can differ by region.",
    "general",
    1,
  ],
  [
    "What games are available?",
    "Roulette, blackjack, baccarat, Teen Patti, poker, Dragon Tiger, slots and live games.",
    "general",
    2,
  ],
  [
    "How can I create an account?",
    "This site is informational. Use the contact page or WhatsApp to reach the team.",
    "general",
    3,
  ],
  [
    "How can I contact support?",
    "Use the contact form or the WhatsApp button on every page.",
    "support",
    4,
  ],
  [
    "Is the website mobile friendly?",
    "Yes. The layout works on phones, tablets and desktops.",
    "general",
    5,
  ],
  [
    "Where can I read the terms and conditions?",
    "See the Terms & Conditions page in the footer.",
    "legal",
    6,
  ],
  [
    "What responsible gaming information is available?",
    "See the Responsible Gaming page for guidance and support links.",
    "legal",
    7,
  ],
].map(([question, answer, category, sort_order]) => ({
  question: question as string,
  answer: answer as string,
  category: category as string,
  sort_order: sort_order as number,
  status: "published" as const,
}));

/**
 * CMS pages backing the seeded /cricket, /football and /tennis navigation links.
 *
 * These URLs shipped in `navigation_items` but had no route and no content, so every one of them
 * 404'd. The `/$slug` catch-all now renders them from here.
 */
export const PAGES = [
  {
    title: "Cricket",
    slug: "cricket",
    short_description: "Domestic and international cricket coverage, fixtures and match pages.",
    content:
      "<p>Follow cricket across formats, from franchise T20 through to Test series, with fixture lists arranged by competition.</p>" +
      "<h2>What you will find</h2>" +
      "<ul><li>Match schedules grouped by tournament</li><li>Team and venue pages</li><li>Format guides for newcomers</li></ul>" +
      "<p>Coverage and availability can differ by region. 18+ only — play responsibly.</p>",
    sort_order: 1,
  },
  {
    title: "Football",
    slug: "football",
    short_description: "League and cup football coverage, organised by competition.",
    content:
      "<p>League and cup coverage in one place, sorted by competition so you always know what is on next.</p>" +
      "<h2>What you will find</h2>" +
      "<ul><li>Fixture lists by league and cup</li><li>Club and competition pages</li><li>Weekend and midweek schedules</li></ul>" +
      "<p>Coverage and availability can differ by region. 18+ only — play responsibly.</p>",
    sort_order: 2,
  },
  {
    title: "Tennis",
    slug: "tennis",
    short_description: "Court-by-court tennis schedules across every season.",
    content:
      "<p>Court schedules made simple, across hard, clay and grass seasons.</p>" +
      "<h2>What you will find</h2>" +
      "<ul><li>Tournament draws and daily order of play</li><li>Surface-by-surface season guides</li><li>Player and event pages</li></ul>" +
      "<p>Coverage and availability can differ by region. 18+ only — play responsibly.</p>",
    sort_order: 3,
  },
  {
    title: "Privacy Policy",
    slug: "privacy-policy",
    short_description: "How information submitted through this website is handled.",
    content:
      "<h2>What this policy covers</h2><p>This policy explains how information submitted through this website is handled. It applies to the contact form and to messages you start through the published WhatsApp support channel.</p>" +
      "<h2>Information we collect</h2><p>We only collect what you choose to send us: your name, email address, optional phone number, message content and basic technical information your browser sends with any web request.</p>" +
      "<h2>How it is used</h2><p>Contact details are used to answer your question and keep a record of the conversation. We do not sell your information or use it for unrelated marketing without your consent.</p>" +
      "<h2>Your choices</h2><p>You can ask us to correct or delete the details you have sent by contacting support. Please avoid sending sensitive information such as identity documents or payment data through the contact form.</p>",
    sort_order: 4,
  },
  {
    title: "Terms & Conditions",
    slug: "terms",
    short_description: "The terms that govern use of the Strike Arena website.",
    content:
      "<h2>Acceptance of these terms</h2><p>By using this website you agree to these terms. If you do not agree with any part of them, please stop using the site.</p>" +
      "<h2>Eligibility</h2><p>You must be an adult of legal age in your jurisdiction and located somewhere this service is legally permitted.</p>" +
      "<h2>Acceptable use</h2><p>Do not provide false information, disrupt the site, attempt unauthorised access, or copy and republish site content without permission.</p>" +
      "<h2>Availability and content</h2><p>Features, categories and pages may change, be limited by region, or be withdrawn. Content is provided for general information and entertainment and makes no promise of any particular outcome.</p>" +
      "<h2>Changes and contact</h2><p>These terms may be updated from time to time. For questions, use the contact form or the WhatsApp support button.</p>",
    sort_order: 5,
  },
].map((row) => ({
  ...row,
  featured_image: null,
  background_image: null,
  seo_title: null,
  seo_description: null,
  seo_keywords: null,
  seo_image: null,
  canonical_url: null,
  status: "published" as const,
  blocks: [],
}));

/** Demo rows so the previously orphaned admin screens render something on a fresh install. */
export const PROMOTIONS = [
  {
    title: "Welcome To Strike Arena",
    short_description:
      "Explore sports coverage and gaming categories across one mobile-first platform.",
    button_text: "Explore Games",
    button_url: "/games",
    sort_order: 1,
  },
  {
    title: "Live Sports Every Day",
    short_description: "Cricket, football and tennis schedules updated throughout the week.",
    button_text: "See Sports",
    button_url: "/sports",
    sort_order: 2,
  },
].map((row) => ({
  ...row,
  image_url: null,
  start_date: null,
  end_date: null,
  status: "published" as const,
}));

export const SCREENSHOTS = [
  {
    title: "Home Screen",
    description: "The homepage on a phone.",
    category: "demo",
    sort_order: 1,
  },
  {
    title: "Sports List",
    description: "Browsing sports categories.",
    category: "demo",
    sort_order: 2,
  },
  {
    title: "Games Grid",
    description: "The games grid on mobile.",
    category: "demo",
    sort_order: 3,
  },
].map((row) => ({ ...row, image_url: null, status: "published" as const }));

export const AVAILABLE_SITES = [
  {
    name: "Strike Arena Demo",
    description: "A sample platform layout you can explore.",
    category: "Demo",
    button_text: "Learn More",
    button_url: "/about",
    sort_order: 1,
  },
].map((row) => ({ ...row, logo_url: null, image_url: null, status: "published" as const }));

/** Per-path SEO overrides for the pages that already exist as static routes. */
export const SEO_SETTINGS = [
  {
    path: "/",
    seo_title: "Strike Arena — Sports & Online Gaming Entertainment",
    meta_description:
      "Explore cricket, football, tennis and casino-style gaming categories in one premium, mobile-first entertainment platform.",
  },
  {
    path: "/sports",
    seo_title: "Sports — Live Coverage | Strike Arena",
    meta_description: "Cricket, football, tennis and more, organised by competition.",
  },
  {
    path: "/games",
    seo_title: "Games — Explore Every Category | Strike Arena",
    meta_description: "Card rooms, reel titles and live studio formats in one grid.",
  },
  {
    path: "/blog",
    seo_title: "Blog — News, Guides & Updates | Strike Arena",
    meta_description: "Match previews, platform guides and product updates.",
  },
].map((row) => ({ ...row, keywords: null, canonical_url: null, og_image: null }));

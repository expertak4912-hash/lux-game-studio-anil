import sportCricket from "@/assets/sport-cricket.jpg";
import sportFootball from "@/assets/sport-football.jpg";
import sportTennis from "@/assets/sport-tennis.jpg";
import sportBasketball from "@/assets/sport-basketball.jpg";
import sportOther from "@/assets/sport-other.jpg";
import gameRoulette from "@/assets/game-roulette.jpg";
import gameBlackjack from "@/assets/game-blackjack.jpg";
import gameBaccarat from "@/assets/game-baccarat.jpg";
import gameTeenPatti from "@/assets/game-teenpatti.jpg";
import gamePoker from "@/assets/game-poker.jpg";
import gameDragonTiger from "@/assets/game-dragontiger.jpg";
import gameSlots from "@/assets/game-slots.jpg";
import gameLive from "@/assets/game-live.jpg";

export const BRAND = "STRIKE ARENA";

/** [YOUR WHATSAPP LINK] — replace with the real wa.me / api.whatsapp.com link. */
export const WHATSAPP_LINK = "https://wa.me/000000000000";

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Sports", to: "/sports" },
  { label: "Casino", to: "/casino" },
  { label: "Games", to: "/games" },
  { label: "About", to: "/about" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
] as const;

export const LEGAL_LINKS = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Responsible Gaming", to: "/responsible-gaming" },
] as const;

export type SportItem = {
  name: string;
  description: string;
  image: string;
};

export const SPORTS: SportItem[] = [
  {
    name: "Cricket",
    description:
      "Follow domestic and international fixtures with a clean, floodlit-night viewing layout built for match days.",
    image: sportCricket,
  },
  {
    name: "Football",
    description:
      "League and cup coverage organised by competition, so you always know what is on next.",
    image: sportFootball,
  },
  {
    name: "Tennis",
    description:
      "Court-by-court schedules across hard, clay and grass seasons in a simple, readable format.",
    image: sportTennis,
  },
  {
    name: "Basketball",
    description: "Fast-moving fixture lists and team pages designed for quick scanning on a phone.",
    image: sportBasketball,
  },
  {
    name: "Other Sports",
    description: "Badminton, hockey, table tennis and more, grouped into one tidy discovery hub.",
    image: sportOther,
  },
];

export type GameItem = {
  name: string;
  description: string;
  image: string;
  tag: string;
};

export const GAMES: GameItem[] = [
  {
    name: "Roulette",
    tag: "Table",
    description: "A classic wheel presentation with an uncluttered, easy-to-read table view.",
    image: gameRoulette,
  },
  {
    name: "Blackjack",
    tag: "Cards",
    description: "Familiar card play with clear layouts and comfortable touch controls.",
    image: gameBlackjack,
  },
  {
    name: "Baccarat",
    tag: "Cards",
    description: "A refined, minimal interface that keeps every round easy to follow.",
    image: gameBaccarat,
  },
  {
    name: "Teen Patti",
    tag: "Cards",
    description: "A regional favourite presented with modern typography and calm pacing.",
    image: gameTeenPatti,
  },
  {
    name: "Poker",
    tag: "Cards",
    description: "Table lobbies arranged for clarity, with readable states on any screen size.",
    image: gamePoker,
  },
  {
    name: "Dragon Tiger",
    tag: "Fast play",
    description: "A short-format card game with a simple two-side layout.",
    image: gameDragonTiger,
  },
  {
    name: "Slots",
    tag: "Reels",
    description: "Themed reel titles browsable by category with quick previews.",
    image: gameSlots,
  },
  {
    name: "Live Games",
    tag: "Studio",
    description: "Studio-style presentations streamed into a responsive viewing layout.",
    image: gameLive,
  },
];

export const FAQS = [
  {
    q: "What sports are available?",
    a: "The sports hub covers cricket, football, tennis and basketball, plus a grouped section for other sports such as badminton, hockey and table tennis. Availability can differ by region.",
  },
  {
    q: "What games are available?",
    a: "The gaming section presents roulette, blackjack, baccarat, Teen Patti, poker, Dragon Tiger, slot-style titles and live studio games. Each category has its own page with a short description.",
  },
  {
    q: "How can I create an account?",
    a: "Choose Register in the header and follow the on-screen steps. Registration is limited to adults who meet the eligibility rules of the jurisdictions where the service is legally permitted.",
  },
  {
    q: "How can I contact support?",
    a: "Use the contact form on the Contact page or the WhatsApp support button that appears on every page. Support replies through the channels published on this website only.",
  },
  {
    q: "Is the website mobile friendly?",
    a: "Yes. The layout is built mobile-first and adapts to phones, tablets, laptops and desktops without horizontal scrolling, with touch-friendly buttons throughout.",
  },
  {
    q: "Where can I read the terms and conditions?",
    a: "The Terms & Conditions page sets out acceptable use, eligibility and the limits of this website. The Privacy Policy explains how information submitted through the contact form is handled.",
  },
  {
    q: "What responsible gaming information is available?",
    a: "The Responsible Gaming page explains how to keep participation informed and in proportion, including time and spend awareness, self-exclusion concepts and where to find independent help.",
  },
] as const;

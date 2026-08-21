-- ============ helpers ============
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

-- ============ roles ============
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','editor');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(),'admin')
$$;

-- ============ singleton settings tables ============
CREATE TABLE public.site_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_name text NOT NULL DEFAULT 'Strike Arena',
  tagline text DEFAULT 'Sports and gaming entertainment',
  description text DEFAULT 'A modern sports and gaming entertainment platform.',
  logo_url text, favicon_url text,
  whatsapp_url text DEFAULT 'https://wa.me/000000000000',
  email text, phone text,
  social_links jsonb NOT NULL DEFAULT '[]'::jsonb,
  copyright_text text DEFAULT '© Strike Arena. All rights reserved.',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.theme_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  primary_color text NOT NULL DEFAULT '#f0b429',
  secondary_color text NOT NULL DEFAULT '#7c3aed',
  accent_color text NOT NULL DEFAULT '#22c55e',
  button_color text NOT NULL DEFAULT '#f0b429',
  button_text_color text NOT NULL DEFAULT '#140f02',
  header_color text NOT NULL DEFAULT '#120d1f',
  footer_color text NOT NULL DEFAULT '#100b1a',
  card_color text NOT NULL DEFAULT '#1a1330',
  background_color text NOT NULL DEFAULT '#0f0a1c',
  text_color text NOT NULL DEFAULT '#f5f3ff',
  heading_color text NOT NULL DEFAULT '#ffffff',
  font_family text NOT NULL DEFAULT 'Manrope',
  heading_font text NOT NULL DEFAULT 'Sora',
  body_font text NOT NULL DEFAULT 'Manrope',
  border_radius text NOT NULL DEFAULT '1rem',
  button_style text NOT NULL DEFAULT 'rounded',
  card_style text NOT NULL DEFAULT 'glass',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.background_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  label text NOT NULL,
  image_url text,
  overlay_color text NOT NULL DEFAULT '#0f0a1c',
  overlay_opacity numeric NOT NULL DEFAULT 0.65,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.support_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  whatsapp_url text DEFAULT 'https://wa.me/000000000000',
  email text, phone text, live_chat_url text, telegram_url text,
  support_text text DEFAULT 'Need help? Our team is available on WhatsApp.',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.footer_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  logo_url text,
  description text DEFAULT 'A modern sports and gaming entertainment platform.',
  footer_links jsonb NOT NULL DEFAULT '[]'::jsonb,
  legal_links jsonb NOT NULL DEFAULT '[]'::jsonb,
  social_links jsonb NOT NULL DEFAULT '[]'::jsonb,
  contact_info text,
  copyright_text text DEFAULT '© Strike Arena. All rights reserved.',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============ content tables ============
CREATE TABLE public.homepage_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  heading text, description text, image_url text,
  button_text text, button_url text,
  sort_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, description text, image_url text,
  button_text text, button_url text,
  sort_order int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, slug text NOT NULL UNIQUE,
  featured_image text, background_image text,
  short_description text, content text,
  seo_title text, seo_description text, seo_keywords text, seo_image text, canonical_url text,
  status text NOT NULL DEFAULT 'draft',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.page_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  block_type text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, slug text NOT NULL UNIQUE,
  short_description text, featured_image text, background_image text,
  content text, button_text text DEFAULT 'Learn More',
  tag text,
  seo_title text, seo_description text, seo_image text,
  status text NOT NULL DEFAULT 'published',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.sports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, slug text NOT NULL UNIQUE,
  icon text, image_url text, background_image text,
  description text, url text,
  sort_order int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, slug text NOT NULL UNIQUE,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, slug text NOT NULL UNIQUE,
  featured_image text, excerpt text, content text,
  author text DEFAULT 'Strike Arena Team',
  category_id uuid REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  tags text[] NOT NULL DEFAULT '{}',
  publish_date timestamptz NOT NULL DEFAULT now(),
  views int NOT NULL DEFAULT 0,
  seo_title text, seo_description text, seo_image text,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.available_sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, logo_url text, image_url text,
  description text, category text,
  button_text text DEFAULT 'Learn More', button_url text,
  sort_order int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.screenshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, image_url text, description text,
  category text NOT NULL DEFAULT 'platform',
  sort_order int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, image_url text, short_description text,
  button_text text DEFAULT 'Learn More', button_url text,
  start_date date, end_date date,
  sort_order int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL, answer text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  sort_order int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL, url text NOT NULL,
  category text NOT NULL DEFAULT 'other',
  alt_text text, size_bytes int,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL, url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  new_tab boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL UNIQUE,
  seo_title text, meta_description text, keywords text,
  canonical_url text, og_image text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, email text NOT NULL, phone text, message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============ grants, RLS, policies ============
DO $$
DECLARE t text;
  public_read text[] := ARRAY['site_settings','theme_settings','background_settings','support_settings','footer_settings','homepage_sections','hero_slides','pages','page_blocks','games','sports','blog_categories','blog_posts','available_sites','screenshots','promotions','faq_items','navigation_items','seo_settings','media'];
  all_tables text[] := ARRAY['site_settings','theme_settings','background_settings','support_settings','footer_settings','homepage_sections','hero_slides','pages','page_blocks','games','sports','blog_categories','blog_posts','available_sites','screenshots','promotions','faq_items','navigation_items','seo_settings','media','contact_messages'];
BEGIN
  FOREACH t IN ARRAY all_tables LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "admins manage %1$s" ON public.%1$I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())', t);
  END LOOP;

  FOREACH t IN ARRAY public_read LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('CREATE POLICY "public read %1$s" ON public.%1$I FOR SELECT TO anon, authenticated USING (true)', t);
  END LOOP;

  FOREACH t IN ARRAY all_tables LOOP
    EXECUTE format('CREATE TRIGGER trg_%1$s_updated BEFORE UPDATE ON public.%1$I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t);
  END LOOP;
END $$;

-- contact form: anyone may submit, only admins read
GRANT INSERT ON public.contact_messages TO anon;
CREATE POLICY "anyone can submit a message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);

-- media table has no updated_at trigger need; drop stray trigger safely
DROP TRIGGER IF EXISTS trg_media_updated ON public.media;
DROP TRIGGER IF EXISTS trg_contact_messages_updated ON public.contact_messages;

-- ============ seed data ============
INSERT INTO public.site_settings (id) VALUES (1);
INSERT INTO public.theme_settings (id) VALUES (1);
INSERT INTO public.support_settings (id) VALUES (1);
INSERT INTO public.footer_settings (id, footer_links, legal_links) VALUES (1,
 '[{"label":"Home","url":"/"},{"label":"Sports","url":"/sports"},{"label":"Games","url":"/games"},{"label":"Blog","url":"/blog"},{"label":"Contact","url":"/contact"}]'::jsonb,
 '[{"label":"Privacy Policy","url":"/privacy-policy"},{"label":"Terms & Conditions","url":"/terms"},{"label":"Responsible Gaming","url":"/responsible-gaming"}]'::jsonb);

INSERT INTO public.background_settings (slug,label) VALUES
 ('home','Homepage Background'),('sports','Sports Background'),('cricket','Cricket Background'),
 ('football','Football Background'),('tennis','Tennis Background'),('games','Games Background'),
 ('blog','Blog Background'),('contact','Contact Background'),('footer','Footer Background');

INSERT INTO public.navigation_items (label,url,sort_order) VALUES
 ('Home','/',1),('Sports','/sports',2),('Cricket','/cricket',3),('Football','/football',4),
 ('Tennis','/tennis',5),('Games','/games',6),('Blog','/blog',7),('Contact','/contact',8);

INSERT INTO public.homepage_sections (slug,name,heading,description,sort_order) VALUES
 ('hero','Hero Slider','Play The Game. Feel The Action.','Sports and gaming entertainment in one modern platform.',1),
 ('sports','Sports Categories','Top Sports','Pick a sport and see what is on today.',2),
 ('live_sports','Live Sports','Live Sports','Follow live action across popular sports.',3),
 ('how_it_works','How It Works','How It Works','Three simple steps to get started.',4),
 ('cricket','Cricket','Cricket','Match pages built for cricket fans.',5),
 ('football','Football','Football','League and cup coverage in one place.',6),
 ('tennis','Tennis','Tennis','Court schedules made simple.',7),
 ('games','Games','Games','Browse popular game categories.',8),
 ('screenshots','Payment Screenshots','Demo Screenshots','Sample screens from the platform.',9),
 ('available_sites','Available Sites','Available Sites','Demo platforms you can explore.',10),
 ('platform_screenshots','Platform Screenshots','Platform Screens','See how the platform looks.',11),
 ('promotions','Promotions','Promotions','Current featured content.',12),
 ('why_us','Why Choose Us','Why Choose Us','Fast, clean and mobile friendly.',13),
 ('mobile','Mobile Section','Built For Mobile','Works well on every phone.',14),
 ('support','Customer Support','Need Help?','Talk to our team on WhatsApp.',15),
 ('faq','FAQ','Common Questions','Short answers to popular questions.',16),
 ('responsible','Responsible Gaming','Play Responsibly','18+ only. Keep it fun.',17),
 ('cta','Final CTA','Ready For The Next Game?','Explore sports and games in one place.',18);

INSERT INTO public.blog_categories (name,slug,sort_order) VALUES
 ('Cricket','cricket',1),('Football','football',2),('Tennis','tennis',3),('Sports','sports',4),
 ('News','news',5),('Guides','guides',6),('Updates','updates',7);

INSERT INTO public.sports (name,slug,description,sort_order) VALUES
 ('Cricket','cricket','Follow domestic and international cricket fixtures.',1),
 ('Football','football','League and cup coverage by competition.',2),
 ('Tennis','tennis','Court schedules across every season.',3),
 ('Basketball','basketball','Fast fixture lists and team pages.',4),
 ('Other Sports','other-sports','Badminton, hockey, table tennis and more.',5);

INSERT INTO public.games (name,slug,short_description,tag,sort_order) VALUES
 ('Roulette','roulette','A classic wheel game with a simple table view.','Table',1),
 ('Blackjack','blackjack','Familiar card play with clear layouts.','Cards',2),
 ('Baccarat','baccarat','A clean, easy to follow card game.','Cards',3),
 ('Teen Patti','teen-patti','A regional favourite with a modern look.','Cards',4),
 ('Poker','poker','Table lobbies arranged for clarity.','Cards',5),
 ('Dragon Tiger','dragon-tiger','A short card game with two sides.','Fast play',6),
 ('Slots','slots','Themed reel titles by category.','Reels',7),
 ('Live Games','live-games','Studio style games in a responsive layout.','Studio',8);

INSERT INTO public.faq_items (question,answer,category,sort_order) VALUES
 ('What sports are available?','Cricket, football, tennis, basketball and more. Availability can differ by region.','general',1),
 ('What games are available?','Roulette, blackjack, baccarat, Teen Patti, poker, Dragon Tiger, slots and live games.','general',2),
 ('How can I create an account?','This site is informational. Use the contact page or WhatsApp to reach the team.','general',3),
 ('How can I contact support?','Use the contact form or the WhatsApp button on every page.','support',4),
 ('Is the website mobile friendly?','Yes. The layout works on phones, tablets and desktops.','general',5),
 ('Where can I read the terms and conditions?','See the Terms & Conditions page in the footer.','legal',6),
 ('What responsible gaming information is available?','See the Responsible Gaming page for guidance and support links.','legal',7);

INSERT INTO public.hero_slides (title,description,button_text,button_url,sort_order) VALUES
 ('Play The Game. Feel The Action.','Sports and gaming entertainment in one modern platform.','Explore Games','/games',1),
 ('Live Sports Every Day','Cricket, football and tennis coverage in one place.','See Cricket','/cricket',2);

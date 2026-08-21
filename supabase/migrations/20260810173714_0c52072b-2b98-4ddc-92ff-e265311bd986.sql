DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['available_sites','background_settings','blog_categories','blog_posts','faq_items','footer_settings','games','hero_slides','homepage_sections','media','navigation_items','page_blocks','pages','promotions','screenshots','seo_settings','site_settings','sports','support_settings','theme_settings']
  LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
  END LOOP;
END $$;

GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
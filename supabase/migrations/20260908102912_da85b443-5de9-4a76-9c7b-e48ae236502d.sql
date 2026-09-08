
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  username text NOT NULL,
  email text,
  avatar_url text,
  country text NOT NULL DEFAULT '',
  role text,
  level text,
  centre text NOT NULL DEFAULT '',
  headline text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  interests text[] NOT NULL DEFAULT '{}',
  verified boolean NOT NULL DEFAULT false,
  online boolean NOT NULL DEFAULT false,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX profiles_username_lower_key ON public.profiles (lower(username));
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE base text; candidate text; n int := 0;
BEGIN
  base := lower(regexp_replace(coalesce(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1), 'member'), '[^a-zA-Z0-9_]', '_', 'g'));
  IF length(base) < 3 THEN base := base || 'tian'; END IF;
  base := left(base, 24);
  candidate := base;
  WHILE EXISTS (SELECT 1 FROM public.profiles p WHERE lower(p.username) = candidate) LOOP
    n := n + 1; candidate := left(base, 24) || n::text;
  END LOOP;
  INSERT INTO public.profiles (id, full_name, username, email)
  VALUES (NEW.id, coalesce(NEW.raw_user_meta_data->>'full_name', ''), candidate, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.contacts (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, contact_user_id)
);
GRANT SELECT, INSERT, DELETE ON public.contacts TO authenticated;
GRANT ALL ON public.contacts TO service_role;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contacts_own" ON public.contacts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND user_id <> contact_user_id);

CREATE TABLE public.blocks (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, blocked_user_id)
);
GRANT SELECT, INSERT, DELETE ON public.blocks TO authenticated;
GRANT ALL ON public.blocks TO service_role;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blocks_own" ON public.blocks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND user_id <> blocked_user_id);

CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_b uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_message_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT conversations_ordered CHECK (user_a < user_b),
  CONSTRAINT conversations_pair_unique UNIQUE (user_a, user_b)
);
GRANT SELECT, INSERT, UPDATE ON public.conversations TO authenticated;
GRANT ALL ON public.conversations TO service_role;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "conversations_member_select" ON public.conversations FOR SELECT TO authenticated USING (auth.uid() = user_a OR auth.uid() = user_b);
CREATE POLICY "conversations_member_insert" ON public.conversations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_a OR auth.uid() = user_b);
CREATE POLICY "conversations_member_update" ON public.conversations FOR UPDATE TO authenticated USING (auth.uid() = user_a OR auth.uid() = user_b) WITH CHECK (auth.uid() = user_a OR auth.uid() = user_b);

CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL DEFAULT '',
  kind text NOT NULL DEFAULT 'text',
  duration_sec integer,
  call_mode text,
  call_outcome text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX messages_conversation_idx ON public.messages (conversation_id, created_at);
GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.is_conversation_member(_conversation_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = _conversation_id AND (c.user_a = _user_id OR c.user_b = _user_id));
$$;
CREATE POLICY "messages_member_select" ON public.messages FOR SELECT TO authenticated USING (public.is_conversation_member(conversation_id, auth.uid()));
CREATE POLICY "messages_member_insert" ON public.messages FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid() AND public.is_conversation_member(conversation_id, auth.uid()));
CREATE POLICY "messages_member_update" ON public.messages FOR UPDATE TO authenticated USING (public.is_conversation_member(conversation_id, auth.uid())) WITH CHECK (public.is_conversation_member(conversation_id, auth.uid()));

CREATE TABLE public.statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'text',
  body text NOT NULL DEFAULT '',
  media_url text,
  background text,
  privacy text NOT NULL DEFAULT 'contacts',
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours')
);
GRANT SELECT, INSERT, DELETE ON public.statuses TO authenticated;
GRANT ALL ON public.statuses TO service_role;
ALTER TABLE public.statuses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "statuses_own" ON public.statuses FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "statuses_visible" ON public.statuses FOR SELECT TO authenticated USING (
  expires_at > now()
  AND NOT EXISTS (SELECT 1 FROM public.blocks b WHERE b.user_id = statuses.user_id AND b.blocked_user_id = auth.uid())
  AND (
    privacy = 'everyone'
    OR (privacy = 'contacts' AND EXISTS (SELECT 1 FROM public.contacts c WHERE c.user_id = statuses.user_id AND c.contact_user_id = auth.uid()))
    OR (privacy = 'verified' AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.verified))
  )
);

CREATE TABLE public.status_views (
  status_id uuid NOT NULL REFERENCES public.statuses(id) ON DELETE CASCADE,
  viewer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (status_id, viewer_id)
);
GRANT SELECT, INSERT ON public.status_views TO authenticated;
GRANT ALL ON public.status_views TO service_role;
ALTER TABLE public.status_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "status_views_insert_self" ON public.status_views FOR INSERT TO authenticated WITH CHECK (viewer_id = auth.uid());
CREATE POLICY "status_views_select" ON public.status_views FOR SELECT TO authenticated USING (
  viewer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.statuses s WHERE s.id = status_views.status_id AND s.user_id = auth.uid())
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;

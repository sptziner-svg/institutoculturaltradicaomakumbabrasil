CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  starts_at timestamptz NOT NULL,
  location text,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can read published events" ON public.events FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "admins can read all events" ON public.events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins can insert events" ON public.events FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins can update events" ON public.events FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins can delete events" ON public.events FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER events_set_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.membership_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact text NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'novo',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.membership_requests TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.membership_requests TO authenticated;
GRANT ALL ON public.membership_requests TO service_role;
ALTER TABLE public.membership_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can send a request" ON public.membership_requests FOR INSERT TO anon, authenticated WITH CHECK (char_length(name) BETWEEN 2 AND 120 AND char_length(contact) BETWEEN 5 AND 160 AND (message IS NULL OR char_length(message) <= 1000));
CREATE POLICY "admins can read requests" ON public.membership_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins can update requests" ON public.membership_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins can delete requests" ON public.membership_requests FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.events (title, description, starts_at, location, published) VALUES
('Gira de Quimbanda', 'Gira aberta a quem chega com respeito. Traje branco ou vermelho e preto.', now() + interval '14 days', 'Rua Oito, Jd Aguapeú — Itanhaém/SP', true),
('Roda de conversa sobre tradição', 'Encontro de ensinamento e escuta dos mais velhos, aberto a interessados.', now() + interval '35 days', 'Rua Oito, Jd Aguapeú — Itanhaém/SP', true);

CREATE TABLE public.staff_users (
  id text NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL DEFAULT '',
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.staff_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read staff_users" ON public.staff_users
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public manage staff_users" ON public.staff_users
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Seed default admin user
INSERT INTO public.staff_users (id, name, email, password, role, active) VALUES
  ('admin-default', 'Admin', 'admin@store.com', 'admin123', 'admin', true);

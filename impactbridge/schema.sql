-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  email TEXT,
  role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'NGO_ADMIN')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Problems table
CREATE TABLE public.problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  people_affected INTEGER NOT NULL,
  urgency TEXT NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'REPORTED' CHECK (status IN ('REPORTED', 'UNDER_REVIEW', 'VERIFIED', 'FUNDRAISER_CREATED', 'SOLVED')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fundraisers table
CREATE TABLE public.fundraisers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_amount NUMERIC NOT NULL,
  raised_amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Donations table
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fundraiser_id UUID REFERENCES public.fundraisers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  amount NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Impact Updates table
CREATE TABLE public.impact_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fundraiser_id UUID REFERENCES public.fundraisers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fundraisers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_updates ENABLE ROW LEVEL SECURITY;

-- Create Policies (simplified for MVP: allow all reads, allow authenticated inserts/updates)
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Problems are viewable by everyone." ON public.problems FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create problems." ON public.problems FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "NGO Admins can update problems." ON public.problems FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'NGO_ADMIN')
);

CREATE POLICY "Fundraisers are viewable by everyone." ON public.fundraisers FOR SELECT USING (true);
CREATE POLICY "NGO Admins can create fundraisers." ON public.fundraisers FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'NGO_ADMIN')
);
CREATE POLICY "NGO Admins can update fundraisers." ON public.fundraisers FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'NGO_ADMIN')
);

CREATE POLICY "Donations are viewable by everyone." ON public.donations FOR SELECT USING (true);
CREATE POLICY "Authenticated users can donate." ON public.donations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Impact updates are viewable by everyone." ON public.impact_updates FOR SELECT USING (true);
CREATE POLICY "NGO Admins can create impact updates." ON public.impact_updates FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'NGO_ADMIN')
);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, 'USER');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Seed data for MVP
INSERT INTO public.problems (id, title, description, category, location, people_affected, urgency, status)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Safe Drinking Water for Rural School', 'The local school in Rajasthan lacks access to safe drinking water, affecting 200 children.', 'Water', 'Rajasthan, India', 200, 'High', 'FUNDRAISER_CREATED'),
  ('22222222-2222-2222-2222-222222222222', 'Computers for Rural Students', 'Students in a rural village need computers for digital literacy.', 'Education', 'Bihar, India', 150, 'Medium', 'FUNDRAISER_CREATED'),
  ('33333333-3333-3333-3333-333333333333', 'Community Medical Camp', 'Need to organize a free medical camp for elderly residents.', 'Health', 'Odisha, India', 300, 'High', 'FUNDRAISER_CREATED'),
  ('44444444-4444-4444-4444-444444444444', 'School Infrastructure Repair', 'Roof of the primary school needs immediate repair before monsoon.', 'Infrastructure', 'Kerala, India', 100, 'Urgent', 'VERIFIED'),
  ('55555555-5555-5555-5555-555555555555', 'Food Support for Elderly Residents', 'Monthly ration support for destitute elderly citizens.', 'Food', 'Maharashtra, India', 50, 'High', 'REPORTED');

INSERT INTO public.fundraisers (id, problem_id, title, description, target_amount, raised_amount, status)
VALUES
  ('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'Provide Safe Water in Rajasthan', 'Help us install a water purification system.', 72000, 15000, 'ACTIVE'),
  ('77777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', 'Digital Lab for Bihar Students', 'Help us buy 10 refurbished computers.', 150000, 45000, 'ACTIVE'),
  ('88888888-8888-8888-8888-888888888888', '33333333-3333-3333-3333-333333333333', 'Medical Camp in Odisha', 'Funding for doctors and free medicines.', 50000, 5000, 'ACTIVE');

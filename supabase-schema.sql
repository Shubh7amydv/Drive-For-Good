-- Golf Charity Subscription Platform
-- Supabase PostgreSQL schema (production-ready starter)

create extension if not exists pgcrypto;

-- Profiles linked to Supabase Auth users
create table if not exists public.profiles (
	id uuid primary key references auth.users(id) on delete cascade,
	full_name text not null,
	role text not null default 'user' check (role in ('user', 'admin')),
	charity_percent numeric(5,2) not null default 10 check (charity_percent >= 10 and charity_percent <= 100),
	independent_donation numeric(10,2) not null default 0,
	winnings_total numeric(12,2) not null default 0,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists public.charities (
	id uuid primary key default gen_random_uuid(),
	name text not null unique,
	category text not null,
	description text not null,
	image_url text,
	events jsonb not null default '[]'::jsonb,
	featured boolean not null default false,
	active boolean not null default true,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists public.user_charities (
	user_id uuid primary key references public.profiles(id) on delete cascade,
	charity_id uuid not null references public.charities(id),
	updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null unique references public.profiles(id) on delete cascade,
	provider text not null default 'razorpay',
	provider_customer_id text,
	provider_subscription_id text,
	plan text not null check (plan in ('monthly', 'yearly')),
	status text not null check (status in ('active', 'inactive', 'canceled', 'past_due', 'trialing')),
	amount numeric(10,2) not null,
	currency text not null default 'usd',
	started_at timestamptz not null default now(),
	renewal_date date,
	canceled_at timestamptz,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists public.scores (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references public.profiles(id) on delete cascade,
	score_value int not null check (score_value between 1 and 45),
	score_date date not null,
	created_at timestamptz not null default now()
);

create index if not exists idx_scores_user_date on public.scores(user_id, score_date desc, created_at desc);

create table if not exists public.draws (
	id uuid primary key default gen_random_uuid(),
	draw_month date not null,
	mode text not null check (mode in ('random', 'algorithm')),
	draw_numbers int[] not null check (array_length(draw_numbers, 1) = 5),
	active_subscribers int not null default 0,
	pool_total numeric(12,2) not null default 0,
	pool_five numeric(12,2) not null default 0,
	pool_four numeric(12,2) not null default 0,
	pool_three numeric(12,2) not null default 0,
	jackpot_rollover numeric(12,2) not null default 0,
	simulation_only boolean not null default false,
	published_at timestamptz,
	created_by uuid references public.profiles(id),
	created_at timestamptz not null default now()
);

create table if not exists public.winners (
	id uuid primary key default gen_random_uuid(),
	draw_id uuid not null references public.draws(id) on delete cascade,
	user_id uuid not null references public.profiles(id) on delete cascade,
	match_type int not null check (match_type in (3,4,5)),
	amount numeric(12,2) not null default 0,
	proof_url text,
	verification_status text not null default 'pending' check (verification_status in ('pending','submitted','approved','rejected')),
	payment_status text not null default 'pending' check (payment_status in ('pending','paid')),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists public.donations (
	id uuid primary key default gen_random_uuid(),
	user_id uuid references public.profiles(id) on delete set null,
	charity_id uuid not null references public.charities(id),
	amount numeric(12,2) not null check (amount > 0),
	source text not null check (source in ('subscription','independent')),
	note text,
	created_at timestamptz not null default now()
);

create table if not exists public.notifications (
	id uuid primary key default gen_random_uuid(),
	user_id uuid references public.profiles(id) on delete cascade,
	channel text not null default 'email' check (channel in ('email', 'in_app')),
	type text not null,
	subject text not null,
	body text not null,
	sent boolean not null default false,
	sent_at timestamptz,
	created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
	new.updated_at = now();
	return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists trg_charities_updated_at on public.charities;
create trigger trg_charities_updated_at
before update on public.charities
for each row execute function public.touch_updated_at();

drop trigger if exists trg_subscriptions_updated_at on public.subscriptions;
create trigger trg_subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.touch_updated_at();

drop trigger if exists trg_winners_updated_at on public.winners;
create trigger trg_winners_updated_at
before update on public.winners
for each row execute function public.touch_updated_at();

-- Keep only latest 5 scores per user automatically.
create or replace function public.enforce_latest_five_scores()
returns trigger
language plpgsql
as $$
begin
	delete from public.scores
	where id in (
		select id
		from public.scores
		where user_id = new.user_id
		order by score_date desc, created_at desc
		offset 5
	);
	return new;
end;
$$;

drop trigger if exists trg_keep_latest_five_scores on public.scores;
create trigger trg_keep_latest_five_scores
after insert on public.scores
for each row execute function public.enforce_latest_five_scores();

alter table public.profiles enable row level security;
alter table public.charities enable row level security;
alter table public.user_charities enable row level security;
alter table public.subscriptions enable row level security;
alter table public.scores enable row level security;
alter table public.draws enable row level security;
alter table public.winners enable row level security;
alter table public.donations enable row level security;
alter table public.notifications enable row level security;

-- Public charity read access.
drop policy if exists charities_select_public on public.charities;
create policy charities_select_public
on public.charities for select
using (active = true);

-- User can read/update own profile.
drop policy if exists profiles_self_select on public.profiles;
create policy profiles_self_select
on public.profiles for select
using (auth.uid() = id);

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- User can read and manage own records.
drop policy if exists scores_self_all on public.scores;
create policy scores_self_all
on public.scores for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists subscriptions_self_all on public.subscriptions;
create policy subscriptions_self_all
on public.subscriptions for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists user_charities_self_all on public.user_charities;
create policy user_charities_self_all
on public.user_charities for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists winners_self_select on public.winners;
create policy winners_self_select
on public.winners for select
using (auth.uid() = user_id);

drop policy if exists winners_self_update on public.winners;
create policy winners_self_update
on public.winners for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists donations_self_select on public.donations;
create policy donations_self_select
on public.donations for select
using (auth.uid() = user_id);

drop policy if exists notifications_self_select on public.notifications;
create policy notifications_self_select
on public.notifications for select
using (auth.uid() = user_id);

-- Admin bypass policies based on profile role.
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
as $$
	select exists (
		select 1 from public.profiles p
		where p.id = uid and p.role = 'admin'
	);
$$;

drop policy if exists admin_full_charities on public.charities;
create policy admin_full_charities
on public.charities for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists admin_full_draws on public.draws;
create policy admin_full_draws
on public.draws for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists admin_full_winners on public.winners;
create policy admin_full_winners
on public.winners for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists admin_full_donations on public.donations;
create policy admin_full_donations
on public.donations for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists admin_full_notifications on public.notifications;
create policy admin_full_notifications
on public.notifications for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

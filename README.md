# Tabletop

Find and host local board game nights. People can browse upcoming games near them, claim a seat at the table, and get confirmation emails with event details. Hosts get notified whenever someone joins.

Built with TanStack Start (React 19 + Vite), Tailwind CSS v4, Supabase (Postgres), and Resend for transactional email.

## Prerequisites

- Node.js 20+
- pnpm
- A [Supabase](https://supabase.com) project
- A [Resend](https://resend.com) account with a verified sending domain

## Setup

```bash
git clone <repo-url> boardgame-events
cd boardgame-events
pnpm install
cp .env.example .env
```

Fill in `.env` with your keys (see below), then:

```bash
pnpm dev
```

The app runs at http://localhost:3000.

## Environment variables

```bash
# Client (exposed to the browser)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Server (used by the join-event server function)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=your-resend-key
FROM_EMAIL=noreply@yourdomain.com
```

The `VITE_*` keys are read by the browser client in `src/lib/supabase.ts`. The unprefixed keys are read server-side by the `joinEvent` server function in `src/lib/joinEvent.ts`, which needs the service role key to insert attendees and Resend to send confirmation emails.

## Database schema

Two tables in Supabase:

```sql
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  host_name text not null,
  host_email text not null,
  location text not null,
  scheduled_at timestamptz not null,
  total_players int not null,
  notes text,
  game_type text not null,
  image_url text not null,
  created_at timestamptz not null default now()
);

create table attendees (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  name text not null,
  email text not null,
  joined_at timestamptz not null default now()
);
```

Enable row-level security and add policies that allow anonymous `select` on both tables and anonymous `insert` on `events`. Attendee inserts happen server-side with the service role key, so no anon insert policy is needed for `attendees`.

## Scripts

| Command      | What it does                     |
| ------------ | -------------------------------- |
| `pnpm dev`   | Start the dev server on port 3000 |
| `pnpm build` | Build for production              |
| `pnpm serve` | Preview the production build      |
| `pnpm test`  | Run the Vitest test suite         |

## Project layout

```
src/
  components/   UI components (GameCard, GameInfoModal, CreateEventForm, ...)
  data/         Static game catalog and location list
  lib/          Supabase client and server functions
  routes/       File-based routes (TanStack Router)
  types/        Shared TypeScript types
  styles.css    Tailwind + theme tokens
```

## Hardwood

Next.js 16 + Prisma + PostgreSQL.

## Prerequisites

- Node.js 20+
- npm
- Docker Desktop (for local PostgreSQL)

## Quick Start (Recommended: Docker)

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
# macOS/Linux
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

3. Start PostgreSQL container:

```bash
docker compose up -d postgres
```

4. Push schema and seed data:

```bash
npm run db:push
npm run db:seed
```

5. Start development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Default Admin Account (Seed)

- Email: `admin@hardwoodliving.com`
- Password: `admin123456`

You can override these with environment variables before seeding:
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_USERNAME`
- `SEED_ADMIN_PASSWORD`

## Environment

Default local connection string in `.env.example`:

`DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hardwood?schema=public"`

## Useful Commands

- `npm run dev` - start Next.js dev server
- `npm run build` - build production bundle
- `npm run start` - run production server
- `npm run lint` - run ESLint
- `npm run db:generate` - generate Prisma client
- `npm run db:push` - sync Prisma schema to DB
- `npm run db:seed` - seed initial data
- `docker compose up -d postgres` - start PostgreSQL
- `docker compose down` - stop containers

## Troubleshooting

- `@prisma/client did not initialize yet`: run `npm run db:generate` (or reinstall dependencies, `postinstall` already generates client).
- `P1001: Can't reach database server`: make sure Docker is running and `docker compose ps` shows `postgres` as `healthy`.
- Login returns `503`: database is unavailable or misconfigured in `DATABASE_URL`.

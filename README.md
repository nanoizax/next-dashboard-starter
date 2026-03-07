# Next Dashboard Starter

A production-ready Next.js 15 dashboard starter template with authentication, user management, and a clean architecture.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15 | Framework (App Router) |
| React | 19 | UI Library |
| TypeScript | 5 | Type safety |
| NextAuth.js | 5 (beta) | Authentication |
| Prisma | 5 | ORM |
| PostgreSQL | 16 | Database |
| TanStack Query | 5 | Client-side data fetching |
| Tailwind CSS | 3 | Styling |
| shadcn/ui | — | UI components |
| React Hook Form | 7 | Form management |
| Zod | 3 | Schema validation |
| bcryptjs | — | Password hashing |

## Features

- **Authentication** — Email/password login and registration with JWT sessions
- **Role-based access** — USER, ADMIN, and SUPER_ADMIN roles
- **User management** — Full CRUD with search and pagination
- **Dashboard overview** — Stats cards with key metrics
- **Clean Architecture** — Separation between server actions, API routes, hooks, and components
- **Type-safe** — End-to-end TypeScript with Zod validation
- **Responsive** — Mobile-friendly collapsible sidebar

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd next-dashboard-starter
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dashboard_db"
AUTH_SECRET="your-super-secret-key-min-32-chars"
AUTH_URL="http://localhost:3000"
```

### 3. Start PostgreSQL

```bash
docker compose up -d postgres
```

### 4. Setup database

```bash
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:seed        # Seed with sample data
```

### 5. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Default credentials (after seed)

| Email | Password | Role |
|---|---|---|
| admin@example.com | admin123 | ADMIN |
| alice@example.com | user123 | USER |

## Project Structure

```
next-dashboard-starter/
├── app/
│   ├── (auth)/              # Auth pages (no layout wrapper)
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── layout.tsx       # Auth guard + sidebar layout
│   │   ├── dashboard/       # /dashboard overview
│   │   └── users/           # User management
│   ├── api/                 # REST API routes
│   │   ├── auth/[...nextauth]/
│   │   └── users/
│   ├── layout.tsx           # Root layout with providers
│   ├── globals.css          # CSS variables + Tailwind
│   └── providers.tsx        # TanStack Query provider
├── components/
│   ├── ui/                  # shadcn/ui primitives
│   ├── auth/                # Login and Register forms
│   └── dashboard/           # Sidebar, Header, StatsCard, UserTable
├── lib/
│   ├── auth.ts              # NextAuth configuration
│   ├── db.ts                # Prisma client singleton
│   ├── utils.ts             # Utility functions
│   └── validations.ts       # Zod schemas
├── server/
│   └── actions/             # Next.js Server Actions
│       ├── auth.ts          # Login, register, logout
│       └── users.ts         # CRUD operations
├── hooks/
│   └── useUsers.ts          # TanStack Query hooks
├── types/
│   └── index.ts             # Shared TypeScript types
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed script
├── middleware.ts             # Route protection
└── docker-compose.yml       # PostgreSQL + pgAdmin
```

## API Reference

### Authentication

NextAuth handles auth at `/api/auth/[...nextauth]`.

### Users API

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users` | Required | List users (paginated) |
| POST | `/api/users` | Admin | Create user |
| GET | `/api/users/:id` | Required | Get user by ID |
| PUT | `/api/users/:id` | Admin | Update user |
| DELETE | `/api/users/:id` | Admin | Delete user |

Query params for GET `/api/users`: `page`, `pageSize`, `search`

## Database Commands

```bash
npm run db:generate   # Regenerate Prisma client after schema changes
npm run db:migrate    # Create and apply a new migration
npm run db:push       # Push schema changes (dev only, no migration file)
npm run db:seed       # Seed sample data
npm run db:studio     # Open Prisma Studio at localhost:5555
```

## Docker

```bash
docker compose up -d          # Start PostgreSQL + pgAdmin
docker compose down           # Stop containers
docker compose down -v        # Stop and remove volumes
```

pgAdmin is available at [http://localhost:5050](http://localhost:5050)
- Email: `admin@admin.com`
- Password: `admin`

## Deployment

### Environment variables for production

```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
AUTH_SECRET="<strong-random-secret>"
AUTH_URL="https://yourdomain.com"
```

Generate a secret:
```bash
openssl rand -base64 32
```

### Vercel

```bash
npm install -g vercel
vercel
```

Set environment variables in the Vercel dashboard.

### Self-hosted

```bash
npm run build
npm run start
```

## License

MIT

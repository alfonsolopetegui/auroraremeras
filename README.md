# Remeras E-commerce

E-commerce website for selling printed t-shirts built with Next.js, TypeScript, and Prisma.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

```bash
npm install
```

### Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your database and Mercado Pago credentials.

### Database Setup

```bash
npx prisma migrate dev
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

- `app/` - Next.js App Router pages
  - `(store)/` - Public store routes
  - `(admin)/` - Protected admin routes
  - `api/` - API routes
- `prisma/` - Prisma schema and migrations
- `styles/` - Global and component styles
- `lib/` - Utility functions and helpers
- `public/` - Static assets

## 🛠 Built With

- **Next.js** - React framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **Vercel Postgres** - Database
- **Mercado Pago** - Payment processing
- **Plain CSS** - Styling

## 📝 Notes

This is an MVP e-commerce focused on simplicity and maintainability.

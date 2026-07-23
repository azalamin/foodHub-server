# ⚙️ FoodHub Backend | Modular Express & Prisma API

[![API Status](https://img.shields.io/badge/API-Live-orange.svg?style=for-the-badge)](https://food-hub-server-lime.vercel.app/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-6DA55F?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.0-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.3-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_DB-4169E1?style=for-the-badge&logo=postgresql)](https://neon.tech/)

> The high-performance backend API engine powering the **FoodHub** marketplace. Built with **Express 5**, **TypeScript**, **Prisma ORM**, **Neon PostgreSQL**, **Better Auth**, and **Stripe**. Features a Feature-Based Modular Architecture designed for speed, scale, and clean domain isolation.

---

## 📽️ Project Overview & Video Walkthrough

- **🌐 Live API Endpoint:** [https://food-hub-server-lime.vercel.app](https://food-hub-server-lime.vercel.app)
- **🌐 Live Frontend App:** [https://foodhubbd.vercel.app](https://foodhubbd.vercel.app)
- **📹 Video Demonstration:** [Watch Video Walkthrough](https://drive.google.com/file/d/1-n7CXgJ05I44VifH7hKICdp587Y7-ANc/view?usp=sharing)

---

## 📌 Technical Highlights & Architecture

### 🏗️ 1. Domain-Driven Modular Architecture
Instead of monolithic controllers or routing files, all business logic is organized into clean domain modules (`user`, `meal`, `category`, `provider`, `order`, `review`, `payment`). Each module contains its own routes, controller, and service layer.

### 🗄️ 2. Multi-File Prisma Schema & Driver Adapter
- **Multi-File Schema Structure**: Organized under `prisma/schema/*.prisma` (`auth.prisma`, `meal.prisma`, `orders.prisma`, `category.prisma`, `provider_profiles.prisma`, `review.prisma`).
- **PrismaPg Driver Adapter**: Powered by `@prisma/adapter-pg` and Neon serverless PostgreSQL pooler for instant cold-start response and connection pooling.

### 💳 3. Stripe Payment Gateway & Verification
- **PaymentIntent Creation**: Generates Stripe PaymentIntents with automatic currency conversion (BDT to USD) and metadata tracking (`/api/payments/create-intent`).
- **Instant Payment Verification**: Direct API verification endpoint (`/api/payments/confirm`) checking Stripe API status to update database records to `PAID`.
- **Webhook Engine**: Raw-body express route handler (`/api/payments/webhook`) handling Stripe event hooks asynchronously.

### 📧 4. Transactional Email Engine
Integrated Nodemailer service sending HTML & text email templates for:
- Email verification links (`/verify-email?token=...`)
- Password reset recovery links (`/reset-password?token=...`)
- Detailed order confirmations with item breakdown and address details.

---

## 🛠️ Tech Stack (Backend)

| Component | Technology |
| :--- | :--- |
| **Runtime Environment** | Node.js (Target v20.x) |
| **Server Framework** | Express 5.0 |
| **Language** | TypeScript v5.9 |
| **Database & ORM** | Neon PostgreSQL, Prisma v7.3.0 (`@prisma/adapter-pg`) |
| **Authentication** | Better Auth Node Adapter (`better-auth/node`) |
| **Payments** | Stripe Node SDK (`stripe`) |
| **Mailer & Build Tool** | Nodemailer, `tsup` bundler, `tsx` runner |

---

## 📁 Backend Project Structure

```text
foodHub-server/
├── prisma/
│   ├── schema/                 # Multi-file Prisma schemas
│   │   ├── schema.prisma       # Prisma generator & datasource config
│   │   ├── auth.prisma         # User, Session, Account, Verification
│   │   ├── meal.prisma         # Meal model
│   │   ├── category.prisma     # Category model
│   │   ├── orders.prisma       # Order & OrderItem models
│   │   ├── provider_profiles.prisma # Provider Profile model
│   │   └── review.prisma       # Review model
│   └── migrations/             # SQL database migration history
├── src/
│   ├── emails/                 # Nodemailer email templates
│   ├── errors/                 # Centralized AppError & Zod error handling
│   ├── helpers/                # Response helpers & pagination utilities
│   ├── lib/                    # Core library setups (auth, prisma, mailer)
│   ├── middlewares/            # Auth middleware, role guards, global error handler
│   ├── modules/                # Feature-Based Modules
│   │   ├── user/               # User profiles & role management
│   │   ├── meal/               # Meal CRUD, search & filtering
│   │   ├── category/           # Category operations
│   │   ├── provider/           # Kitchen Provider profiles & orders
│   │   ├── order/              # Customer order placement & tracking
│   │   ├── review/             # Rating & review engine
│   │   └── payment/            # Stripe PaymentIntents & Webhooks
│   ├── scripts/                # Database seeding scripts (`seedAdmin`, `seedMeals`)
│   ├── utils/                  # Async handler wrapper (`catchAsync`)
│   ├── app.ts                  # Express application setup & CORS configuration
│   └── server.ts               # Server startup & port listener
├── prisma.config.ts            # Prisma v7 configuration file
├── package.json
└── tsconfig.json
```

---

## 🔗 Key API Endpoints Overview

| Method | Endpoint | Description | Access Role |
| :--- | :--- | :--- | :--- |
| `ALL` | `/api/auth/*splat` | Better Auth Authentication Routes | Public |
| `GET` | `/api/meals` | Get all meals with filters & search | Public |
| `GET` | `/api/categories` | Get meal categories | Public |
| `POST` | `/api/orders` | Place a new customer order (COD) | `CUSTOMER` |
| `GET` | `/api/orders` | Get logged-in customer orders | `CUSTOMER` |
| `POST` | `/api/payments/create-intent` | Initiate Stripe PaymentIntent | `CUSTOMER` |
| `POST` | `/api/payments/confirm` | Confirm payment completion | `CUSTOMER` |
| `POST` | `/api/payments/webhook` | Stripe Webhook handler | Stripe Server |
| `GET` | `/api/provider/orders` | Get incoming orders for kitchen | `PROVIDER` |
| `PATCH` | `/api/provider/orders/:id/status`| Update order status | `PROVIDER` |
| `GET` | `/api/admin/orders` | Get all platform orders | `ADMIN` |
| `GET` | `/api/admin/users` | Manage registered users | `ADMIN` |

---

## ⚙️ Installation & Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/azalamin/foodhub-server.git
cd foodhub-server
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
PORT=4000
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:4000

APP_URL=http://localhost:3000
APP_USER=your_gmail_address
APP_PASS=your_gmail_app_password

STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

ADMIN_NAME="Al Amin Sheikh"
ADMIN_EMAIL="admin@foodhub.com"
ADMIN_ROLE="ADMIN"
ADMIN_PASSWORD="admin_password"
```

### 3. Database Migration & Prisma Client
```bash
npx prisma generate
npx prisma db push
```

### 4. Seed Initial Data
```bash
npm run seed:admin
npx tsx src/scripts/seedMeals.ts
```

### 5. Start Backend Server
```bash
npm run dev
```
Server runs on [http://localhost:4000](http://localhost:4000).

---

## 👨‍💻 Author

**Al Amin Sheikh**  
*Full-Stack Web Developer (MERN / Next.js / TypeScript)*

- **LinkedIn:** [linkedin.com/in/azalamin](https://www.linkedin.com/in/azalamin/)
- **Live Application:** [foodhubbd.vercel.app](https://foodhubbd.vercel.app)

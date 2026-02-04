# ⚙️ FoodHub Backend | Modular Express & Prisma API

[![API Status](https://img.shields.io/badge/API-Live-orange.svg?style=for-the-badge)](https://food-hub-server-lime.vercel.app/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-6DA55F?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.0-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.3-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

The high-performance engine powering the **FoodHub** marketplace. This backend is built with **Express 5**, **TypeScript**, and **Prisma ORM**, utilizing a modular design for maximum scalability and maintainability.

---

## 📌 Architecture & Design

This project follows a **Feature-Based Modular Architecture**. Instead of giant folders for all controllers or models, logic is grouped by domain (e.g., `meal`, `order`, `provider`), making the codebase intuitive and easy to navigate.

### 🚀 Technical Highlights

- **Express 5 (Beta):** Utilizing the latest features of Express for better asynchronous error handling.
- **Prisma ORM with pg-adapter:** Type-safe database interactions with optimized PostgreSQL connection pooling.
- **Better Auth:** Robust server-side session management and multi-role authentication.
- **Email Engine:** Automated order confirmations and verification flows via **Nodemailer**.

---

## ✨ Core Modules

- **User & Auth:** Advanced account management and role-based access.
- **Meal & Category:** Comprehensive CRUD operations for a dynamic marketplace.
- **Order System:** Logic for handling customer requests and provider updates.
- **Provider Profiles:** Dedicated data isolation for marketplace sellers.
- **Review System:** Integrated customer feedback and rating engine.

---

## 🛠️ Tech Stack

| Layer          | Technology                           |
| :------------- | :----------------------------------- |
| **Runtime**    | Node.js (Target v20)                 |
| **Framework**  | Express.js 5                         |
| **Database**   | PostgreSQL with `@prisma/adapter-pg` |
| **ORM**        | Prisma v7.3.0                        |
| **Validation** | Zod                                  |
| **Build Tool** | tsup (High-speed bundling)           |

---

## 📁 Project Structure

```text
src/
├── emails/             # Nodemailer templates (Order confirmations, etc.)
├── errors/             # Global AppError class & handling logic
├── middlewares/        # Auth guards, role checks, and global error handlers
├── modules/            # Domain-driven feature folders (Meal, Order, Review, etc.)
├── scripts/            # Database seeding scripts (seedMeals.ts, seedAdmin.ts)
├── utils/              # Core utilities like catchAsync and server config
└── server.ts           # Application entry point


```

⚙️ Installation & Setup
Clone & Install:

git clone [https://github.com/azalamin/foodhub-server.git](https://github.com/azalamin/foodhub-server.git)
npm install

Environment Configuration: Create a .env file with your DATABASE_URL and BETTER_AUTH_SECRET.

Database Setup:

```bash
npx prisma generate
npx prisma migrate dev
```

Seed Initial Data:

```bash
npm run seed:admin
npx tsx src/scripts/seedMeals.ts
```

Run Development Server:

```bash
npm run dev
```

### 🏆 Key Solutions Implemented

- Modularization: Successfully moved from a monolithic structure to a module-based design, isolating domain logic for cleaner testing.

- Global Error Handling: Implemented a centralized AppError class and catchAsync utility to ensure zero-crash production runtime.

- Efficient Seeding: Engineered custom scripts to populate a complex relational database while maintaining foreign key integrity.

#### 🌍 Live Demo

👉 https://foodhubbd.vercel.app

### 👨‍💻 Author

Al Amin Sheikh
Full-Stack Web Developer (MERN / Next.js / Prisma)

🔗 LinkedIn: [Al Amin Sheikh](https://www.linkedin.com/in/azalamin/)

🌐 Live Project: [View](https://foodhubbd.vercel.app)

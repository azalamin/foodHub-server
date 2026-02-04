var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import { toNodeHandler } from "better-auth/node";
import express from "express";
import cors from "cors";
import "dotenv/config";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/mailer.ts
import nodemailer from "nodemailer";
if (!process.env.APP_USER || !process.env.APP_PASS) {
  throw new Error("SMTP credentials are missing");
}
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS
  }
});

// src/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'enum UserRole {\n  CUSTOMER\n  PROVIDER\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  SUSPENDED\n}\n\nmodel User {\n  id              String           @id\n  name            String\n  email           String\n  emailVerified   Boolean          @default(false)\n  image           String?\n  createdAt       DateTime         @default(now())\n  updatedAt       DateTime         @updatedAt\n  role            UserRole?        @default(CUSTOMER)\n  phone           String?\n  status          UserStatus?      @default(ACTIVE)\n  sessions        Session[]\n  accounts        Account[]\n  providerProfile ProviderProfile?\n  orders          Order[]          @relation("CustomerOrders")\n  reviews         Review[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Category {\n  id   String @id @default(uuid())\n  name String @unique\n  slug String @unique\n\n  meals Meal[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([id])\n  @@map("category")\n}\n\nenum DietaryType {\n  NONE\n  VEGETARIAN\n  VEGAN\n  HALAL\n  GLUTEN_FREE\n}\n\nmodel Meal {\n  id          String      @id @default(uuid())\n  name        String\n  description String?\n  price       Float\n  imageUrl    String?\n  dietaryType DietaryType @default(NONE)\n  isAvailable Boolean     @default(true)\n\n  providerId String\n  categoryId String\n\n  provider   ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)\n  category   Category        @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n  orderItems OrderItem[]\n  reviews    Review[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([id])\n  @@map("meal")\n}\n\nmodel OrderItem {\n  id        String @id @default(uuid())\n  quantity  Int\n  mealName  String\n  mealPrice Float\n\n  orderId String\n  mealId  String\n\n  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  meal  Meal  @relation(fields: [mealId], references: [id], onDelete: Cascade)\n\n  @@index([id])\n  @@map("order-item")\n}\n\nenum OrderStatus {\n  PLACED\n  PREPARING\n  READY\n  DELIVERED\n  CANCELLED\n}\n\nmodel Order {\n  id              String      @id @default(uuid())\n  status          OrderStatus @default(PLACED)\n  totalPrice      Float\n  deliveryAddress String\n\n  customerId String\n  providerId String\n\n  customer User            @relation("CustomerOrders", fields: [customerId], references: [id], onDelete: Cascade)\n  provider ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)\n\n  items  OrderItem[]\n  review Review?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([id])\n  @@map("order")\n}\n\nmodel ProviderProfile {\n  id             String  @id @default(uuid())\n  userId         String  @unique\n  restaurantName String\n  description    String?\n  address        String\n  phone          String\n  isOpen         Boolean @default(true)\n\n  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  meals  Meal[]\n  orders Order[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([id])\n  @@map("provider-profile")\n}\n\nmodel Review {\n  id      String  @id @default(uuid())\n  rating  Int\n  comment String?\n\n  orderId    String @unique\n  mealId     String\n  customerId String\n\n  order    Order @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  meal     Meal  @relation(fields: [mealId], references: [id], onDelete: Cascade)\n  customer User  @relation(fields: [customerId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n\n  @@index([id])\n  @@map("review")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"phone","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"providerProfile","kind":"object","type":"ProviderProfile","relationName":"ProviderProfileToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"CustomerOrders"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"meals","kind":"object","type":"Meal","relationName":"CategoryToMeal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"category"},"Meal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"dietaryType","kind":"enum","type":"DietaryType"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"MealToProviderProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMeal"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MealToOrderItem"},{"name":"reviews","kind":"object","type":"Review","relationName":"MealToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"meal"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"mealName","kind":"scalar","type":"String"},{"name":"mealPrice","kind":"scalar","type":"Float"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToOrderItem"}],"dbName":"order-item"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"totalPrice","kind":"scalar","type":"Float"},{"name":"deliveryAddress","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerOrders"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"OrderToProviderProfile"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"review","kind":"object","type":"Review","relationName":"OrderToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"order"},"ProviderProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"restaurantName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"isOpen","kind":"scalar","type":"Boolean"},{"name":"user","kind":"object","type":"User","relationName":"ProviderProfileToUser"},{"name":"meals","kind":"object","type":"Meal","relationName":"MealToProviderProfile"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToProviderProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"provider-profile"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToReview"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToReview"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"review"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  MealScalarFieldEnum: () => MealScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  OrderItemScalarFieldEnum: () => OrderItemScalarFieldEnum,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProviderProfileScalarFieldEnum: () => ProviderProfileScalarFieldEnum,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Category: "Category",
  Meal: "Meal",
  OrderItem: "OrderItem",
  Order: "Order",
  ProviderProfile: "ProviderProfile",
  Review: "Review"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  phone: "phone",
  status: "status"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MealScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  price: "price",
  imageUrl: "imageUrl",
  dietaryType: "dietaryType",
  isAvailable: "isAvailable",
  providerId: "providerId",
  categoryId: "categoryId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderItemScalarFieldEnum = {
  id: "id",
  quantity: "quantity",
  mealName: "mealName",
  mealPrice: "mealPrice",
  orderId: "orderId",
  mealId: "mealId"
};
var OrderScalarFieldEnum = {
  id: "id",
  status: "status",
  totalPrice: "totalPrice",
  deliveryAddress: "deliveryAddress",
  customerId: "customerId",
  providerId: "providerId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProviderProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  restaurantName: "restaurantName",
  description: "description",
  address: "address",
  phone: "phone",
  isOpen: "isOpen",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  rating: "rating",
  comment: "comment",
  orderId: "orderId",
  mealId: "mealId",
  customerId: "customerId",
  createdAt: "createdAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var UserRole = {
  CUSTOMER: "CUSTOMER",
  PROVIDER: "PROVIDER",
  ADMIN: "ADMIN"
};
var DietaryType = {
  NONE: "NONE",
  VEGETARIAN: "VEGETARIAN",
  VEGAN: "VEGAN",
  HALAL: "HALAL",
  GLUTEN_FREE: "GLUTEN_FREE"
};
var OrderStatus = {
  PLACED: "PLACED",
  PREPARING: "PREPARING",
  READY: "READY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var basePrisma = new PrismaClient({ adapter });
var prisma = basePrisma.$extends({
  query: {
    user: {
      create: async ({ args, query }) => {
        const user = await query(args);
        if (user.role === UserRole.PROVIDER) {
          const existingProfile = await basePrisma.providerProfile.findUnique({
            where: { userId: user.id }
          });
          if (!existingProfile) {
            await basePrisma.providerProfile.create({
              data: {
                userId: user.id,
                restaurantName: "",
                address: "",
                phone: "",
                isOpen: true
              }
            });
          }
        }
        return user;
      }
    }
  }
});

// src/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [process.env.APP_URL, "https://foodhubbd.vercel.app"],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      accessType: "offline",
      prompt: "select_account consent"
    }
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await transporter.sendMail({
        from: '"FoodHub Security" <auth@foodhub.com>',
        to: user.email,
        subject: "Reset your FoodHub Password",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
          <div style="background: #16a34a; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">FoodHub</h1>
          </div>
          <div style="padding: 40px 20px; text-align: center;">
            <h2 style="color: #111827;">Password Reset Request</h2>
            <p style="color: #4b5563; line-height: 1.6;">Hi ${user.name}, we received a request to reset your password. Click the button below to set a new one.</p>
            <div style="margin: 30px 0;">
              <a href="${url}" style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
            </div>
            <p style="color: #9ca3af; font-size: 12px;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
          </div>
        </div>
        `
      });
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
      const info = await transporter.sendMail({
        from: '"FoodHub" <contact@foodhub.com>',
        to: user.email,
        subject: "Verify your email \u2013 FoodHub",
        text: `
Hi ${user.name || "there"},

Welcome to FoodHub \u{1F371}

Thanks for creating your FoodHub account. Please verify your email address by clicking the link below:

${verificationUrl}

This helps us keep your account secure and ensures you don\u2019t miss important updates.

If you didn\u2019t create this account, you can safely ignore this email.

\u2014 FoodHub Team
`,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your email</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;max-width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="background:#16a34a;padding:24px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:26px;letter-spacing:0.5px;">
                \u{1F371} FoodHub
              </h1>
              <p style="margin:6px 0 0;color:#dcfce7;font-size:14px;">
                Discover & Order Delicious Meals
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;color:#111827;">
              <h2 style="margin-top:0;font-size:22px;">
                Verify your email address
              </h2>

              <p style="font-size:15px;line-height:1.6;">
                Hi <strong>${user.name || "there"}</strong>,
              </p>

              <p style="font-size:15px;line-height:1.6;">
                Thanks for joining <strong>FoodHub</strong>!  
                To complete your registration and start ordering delicious meals,
                please verify your email address.
              </p>

              <!-- Button -->
              <div style="text-align:center;margin:32px 0;">
                <a href="${verificationUrl}"
                  style="
                    background:#16a34a;
                    color:#ffffff;
                    padding:14px 32px;
                    text-decoration:none;
                    border-radius:8px;
                    font-weight:600;
                    font-size:15px;
                    display:inline-block;
                  "
                >
                  Verify Email
                </a>
              </div>

              <p style="font-size:14px;color:#374151;line-height:1.6;">
                If the button doesn\u2019t work, copy and paste this link into your browser:
              </p>

              <p style="font-size:13px;color:#16a34a;word-break:break-all;">
                ${verificationUrl}
              </p>

              <p style="font-size:14px;color:#6b7280;line-height:1.6;margin-top:24px;">
                If you didn\u2019t create a FoodHub account, you can safely ignore this email.
              </p>

              <p style="margin-top:32px;font-size:14px;color:#111827;">
                \u2014 FoodHub Team
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px;text-align:center;font-size:12px;color:#6b7280;">
              \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} FoodHub. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
      });
      console.log("Message sent:", info.messageId);
      try {
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }
});

// src/middlewares/globalErrorHandler.ts
import { ZodError } from "zod";

// src/errors/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
};

// src/middlewares/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal server error";
  const isDev = process.env.NODE_ENV !== "production";
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation error";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        message = "Duplicate value already exists";
        break;
      case "P2003":
        statusCode = 400;
        message = "Invalid reference provided";
        break;
      case "P2025":
        statusCode = 404;
        message = "Record not found";
        break;
      default:
        statusCode = 400;
        message = "Database request error";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid data format provided";
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    statusCode = 500;
    message = "Database connection failed";
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = "Unexpected database error";
  } else if (err instanceof Error) {
    message = err.message || message;
  }
  res.status(statusCode).json({
    success: false,
    message,
    ...isDev && { error: err }
  });
};
var globalErrorHandler_default = globalErrorHandler;

// src/middlewares/notFoundHandler.ts
var notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    path: req.originalUrl,
    method: req.method
  });
};
var notFoundHandler_default = notFoundHandler;

// src/modules/category/category.route.ts
import { Router } from "express";

// src/middlewares/auth.middleware.ts
var authMiddleware = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!"
        });
      }
      if (!session?.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email verification required. Please verify your email!"
        });
      }
      const userRole = session.user.role;
      req.user = {
        id: session?.user.id,
        email: session?.user.email,
        emailVerified: session?.user.emailVerified,
        name: session?.user.name,
        role: userRole
      };
      if (roles.length && !roles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You do not have permission to access this resource!"
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// src/utils/catchAsync.ts
var catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// src/helpers/slugify.ts
var slugify = (text) => {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
};
var slugify_default = slugify;

// src/modules/category/category.service.ts
var createCategory = async (data) => {
  if (!data.name) {
    throw new AppError(400, "Category name is required");
  }
  const slug = slugify_default(data.name);
  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [{ name: data.name }, { slug }]
    }
  });
  if (existingCategory) {
    throw new AppError(409, "Category already exists");
  }
  const result = await prisma.category.create({
    data: {
      name: data.name,
      slug
    }
  });
  return result;
};
var getAllCategories = async () => {
  const result = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
  return result;
};
var updateCategory = async (categoryId, data) => {
  if (!categoryId) {
    throw new AppError(400, "Category ID is required");
  }
  const updateData = { ...data };
  if (data.name) {
    updateData.slug = slugify_default(data.name);
  }
  return prisma.category.update({
    where: { id: categoryId },
    data: updateData
  });
};
var deleteCategory = async (categoryId) => {
  return prisma.category.delete({
    where: { id: categoryId }
  });
};
var categoryService = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
};

// src/modules/category/category.controller.ts
var createCategory2 = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized access");
  }
  if (req.user.role !== UserRole.ADMIN) {
    throw new AppError(403, "Only admin can create categories");
  }
  const result = await categoryService.createCategory(req.body);
  res.status(201).json({
    success: true,
    data: result
  });
});
var getAllCategories2 = catchAsync(async (req, res) => {
  const result = await categoryService.getAllCategories();
  res.status(200).json({
    success: true,
    data: result
  });
});
var updateCategory2 = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const result = await categoryService.updateCategory(categoryId, req.body);
  res.status(200).json({
    success: true,
    data: result
  });
});
var deleteCategory2 = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const result = await categoryService.deleteCategory(categoryId);
  res.status(200).json({
    success: true,
    data: result
  });
});
var categoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/modules/category/category.route.ts
var router = Router();
router.post("/categories", authMiddleware("ADMIN" /* admin */), categoryController.createCategory);
router.get("/categories", categoryController.getAllCategories);
router.patch(
  "/categories/:categoryId",
  authMiddleware("ADMIN" /* admin */),
  categoryController.updateCategory
);
router.delete(
  "/categories/:categoryId",
  authMiddleware("ADMIN" /* admin */),
  categoryController.deleteCategory
);
var categoryRoute = router;

// src/modules/meal/meal.route.ts
import { Router as Router2 } from "express";

// src/helpers/paginationSortingHelper.ts
var paginationSortingHelper = (options) => {
  const page = Math.max(Number(options.page) || 1, 1);
  const limit = Math.max(Number(options.limit) || 10, 1);
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy ?? "createdAt";
  const sortOrder = options.sortOrder ?? "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};
var paginationSortingHelper_default = paginationSortingHelper;

// src/modules/meal/meal.service.ts
var createMeal = async (data, providerId) => {
  if (!providerId) {
    throw new AppError(400, "Provider ID is required");
  }
  const result = await prisma.meal.create({
    data: {
      ...data,
      providerId
    }
  });
  return result;
};
var getAllMeals = async ({
  search,
  categoryId,
  providerId,
  dietaryPreference,
  isAvailable,
  page,
  limit,
  skip,
  sortBy,
  sortOrder
}) => {
  const where = {};
  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive"
        }
      },
      {
        description: {
          contains: search,
          mode: "insensitive"
        }
      }
    ];
  }
  if (categoryId) {
    where.categoryId = categoryId;
  }
  if (providerId) {
    where.providerId = providerId;
  }
  if (dietaryPreference) {
    where.dietaryType = dietaryPreference;
  }
  if (typeof isAvailable === "boolean") {
    where.isAvailable = isAvailable;
  }
  where.provider = {
    user: {
      status: "ACTIVE"
    }
  };
  const meals = await prisma.meal.findMany({
    where,
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      _count: { select: { reviews: true } },
      reviews: true
    }
  });
  const mealsWithRating = meals.map((meal) => {
    const totalReviews = meal.reviews.length;
    const averageRating = totalReviews > 0 ? meal.reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews : 0;
    const { reviews, ...mealData } = meal;
    return {
      ...mealData,
      averageRating: parseFloat(averageRating.toFixed(1))
    };
  });
  const total = await prisma.meal.count({ where });
  return {
    data: mealsWithRating,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getSingleMeal = async (id) => {
  if (!id) {
    throw new AppError(400, "Meal ID is required");
  }
  const meal = await prisma.meal.findFirst({
    where: {
      id,
      provider: {
        user: {
          status: "ACTIVE"
        }
      }
    },
    include: {
      provider: {
        include: {
          user: true
        }
      }
    }
  });
  if (!meal) {
    throw new AppError(404, "Meal not found or not available");
  }
  if (meal.provider.user.status === "SUSPENDED") {
    throw new AppError(403, "This meal is not available");
  }
  return meal;
};
var mealService = {
  createMeal,
  getSingleMeal,
  getAllMeals
};

// src/modules/meal/meal.controller.ts
var createMeal2 = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized access");
  }
  if (req.user.role !== UserRole.PROVIDER) {
    throw new AppError(403, "Only providers can create meals");
  }
  const provider = await prisma.providerProfile.findFirst({
    where: { userId: req.user.id }
  });
  if (!provider) {
    throw new AppError(400, "Provider profile not found");
  }
  const result = await mealService.createMeal(req.body, provider.id);
  res.status(201).json({
    success: true,
    data: result
  });
});
var getSingleMeal2 = catchAsync(async (req, res) => {
  const { mealId } = req.params;
  if (!mealId) {
    throw new AppError(400, "Meal ID is required");
  }
  const result = await mealService.getSingleMeal(mealId);
  if (!result) {
    throw new AppError(404, "Meal not found");
  }
  res.status(200).json({
    success: true,
    data: result
  });
});
var getAllMeals2 = catchAsync(async (req, res) => {
  const search = typeof req.query.search === "string" ? req.query.search : void 0;
  let isAvailable;
  if (typeof req.query.isAvailable === "string") {
    if (req.query.isAvailable === "true") isAvailable = true;
    if (req.query.isAvailable === "false") isAvailable = false;
  }
  const providerId = typeof req.query.providerId === "string" ? req.query.providerId : void 0;
  const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : void 0;
  const dietaryPreference = typeof req.query.dietaryType === "string" && Object.values(DietaryType).includes(req.query.dietaryType) ? req.query.dietaryType : void 0;
  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper_default(req.query);
  const result = await mealService.getAllMeals({
    search,
    categoryId,
    providerId,
    dietaryPreference,
    isAvailable,
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  });
  res.status(200).json({
    success: true,
    data: result
  });
});
var mealController = {
  createMeal: createMeal2,
  getSingleMeal: getSingleMeal2,
  getAllMeals: getAllMeals2
};

// src/modules/meal/meal.route.ts
var router2 = Router2();
router2.post("/meals", authMiddleware("ADMIN" /* admin */, "PROVIDER" /* provider */), mealController.createMeal);
router2.get("/meals", mealController.getAllMeals);
router2.get("/meals/:mealId", mealController.getSingleMeal);
var mealRoute = router2;

// src/modules/order/order.route.ts
import { Router as Router3 } from "express";

// src/emails/orderConfirmation.ts
function orderConfirmationEmail({
  email,
  orderId,
  totalPrice,
  address
}) {
  return {
    from: `"FoodHub" <no-reply@foodhub.com>`,
    to: email,
    subject: "\u{1F371} Order Confirmed \u2013 FoodHub",
    html: `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h2>Order Confirmed \u{1F389}</h2>
        <p>Your order has been placed successfully.</p>

        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Total:</strong> \u09F3${totalPrice}</p>
        <p><strong>Delivery Address:</strong> ${address}</p>

        <p>Payment Method: <strong>Cash on Delivery</strong></p>

        <br/>
        <p>Thanks for ordering with FoodHub \u2764\uFE0F</p>
      </div>
    `
  };
}

// src/modules/order/order.service.ts
var createOrder = async (userId, payload) => {
  if (!payload.items || payload.items.length === 0) {
    throw new AppError(400, "Order must contain at least one item");
  }
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    throw new AppError(401, "User not found");
  }
  const meals = await prisma.meal.findMany({
    where: {
      id: { in: payload.items.map((i) => i.mealId) },
      isAvailable: true,
      provider: {
        isOpen: true,
        user: { status: "ACTIVE" }
      }
    },
    include: {
      provider: true
    }
  });
  const providerId = meals[0].providerId;
  const uniqueProviders = new Set(meals.map((m) => m.providerId));
  if (uniqueProviders.size > 1) {
    throw new AppError(400, "Meals must be from a single provider");
  }
  const orderItemsData = payload.items.map((item) => {
    const meal = meals.find((m) => m.id === item.mealId);
    return {
      mealId: meal.id,
      mealName: meal.name,
      mealPrice: meal.price,
      quantity: item.quantity
    };
  });
  const totalPrice = orderItemsData.reduce((sum, item) => sum + item.mealPrice * item.quantity, 0);
  const order = await prisma.order.create({
    data: {
      customerId: user.id,
      providerId,
      deliveryAddress: payload.deliveryAddress,
      status: OrderStatus.PLACED,
      totalPrice,
      items: {
        create: orderItemsData
      }
    },
    include: {
      items: true
    }
  });
  if (user.email) {
    await transporter.sendMail(
      orderConfirmationEmail({
        email: user.email,
        orderId: order.id,
        totalPrice: order.totalPrice,
        address: order.deliveryAddress
      })
    );
  }
  return order;
};
var getMyOrders = async (userId) => {
  if (!userId) {
    throw new AppError(401, "Unauthorized access");
  }
  return prisma.order.findMany({
    where: {
      customerId: userId
    },
    include: {
      items: {
        include: {
          meal: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getSingleOrder = async (userId, orderId) => {
  if (!orderId) {
    throw new AppError(400, "Order ID is required");
  }
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      customerId: userId
    },
    include: {
      items: {
        include: {
          meal: true
        }
      },
      provider: true
    }
  });
  if (!order) {
    throw new AppError(404, "Order not found");
  }
  return order;
};
var cancelOrder = async (customerId, orderId) => {
  if (!orderId) {
    throw new AppError(400, "Order ID is required");
  }
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      customerId
    }
  });
  if (!order) {
    throw new AppError(404, "Order not found");
  }
  if (order.status !== OrderStatus.PLACED) {
    throw new AppError(400, "Order cannot be cancelled at this stage");
  }
  const cancelledOrder = await prisma.order.update({
    where: {
      id: orderId
    },
    data: {
      status: OrderStatus.CANCELLED
    }
  });
  return cancelledOrder;
};
var getAllOrdersForAdmin = async () => {
  return prisma.order.findMany({
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      provider: {
        select: {
          id: true,
          restaurantName: true
        }
      },
      items: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var updateOrderStatus = async (orderId, newStatus) => {
  if (!orderId) {
    throw new AppError(400, "Provider ID and Order ID are required");
  }
  const order = await prisma.order.findFirst({
    where: {
      id: orderId
    }
  });
  if (!order) {
    throw new AppError(404, "Order not found or unauthorized");
  }
  if (order.status === newStatus) {
    throw new AppError(400, "Order status already updated");
  }
  const validTransitions = {
    PLACED: [OrderStatus.PREPARING],
    PREPARING: [OrderStatus.READY],
    READY: [OrderStatus.DELIVERED],
    DELIVERED: [],
    CANCELLED: []
  };
  if (!validTransitions[order.status].includes(newStatus)) {
    throw new AppError(400, "Invalid order status transition");
  }
  return prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus }
  });
};
var cancelOrderByAdmin = async (orderId) => {
  if (!orderId) {
    throw new AppError(400, "Order ID is required");
  }
  const cancelledOrder = await prisma.order.update({
    where: {
      id: orderId
    },
    data: {
      status: OrderStatus.CANCELLED
    }
  });
  return cancelledOrder;
};
var orderService = {
  createOrder,
  getMyOrders,
  getSingleOrder,
  cancelOrder,
  getAllOrdersForAdmin,
  updateOrderStatus,
  cancelOrderByAdmin
};

// src/modules/order/order.controller.ts
var createOrder2 = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized access");
  }
  if (req.user.role !== UserRole.CUSTOMER) {
    throw new AppError(403, "Only customers can place orders");
  }
  const result = await orderService.createOrder(req.user.id, req.body);
  res.status(201).json({
    success: true,
    data: result
  });
});
var getMyOrders2 = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized access");
  }
  const result = await orderService.getMyOrders(req.user.id);
  res.status(200).json({
    success: true,
    data: result
  });
});
var getSingleOrder2 = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized access");
  }
  const { orderId } = req.params;
  if (!orderId) {
    throw new AppError(400, "Order ID is required");
  }
  const result = await orderService.getSingleOrder(req.user.id, orderId);
  res.status(200).json({
    success: true,
    data: result
  });
});
var cancelOrder2 = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized access");
  }
  if (req.user.role !== UserRole.CUSTOMER) {
    throw new AppError(403, "Only customers can cancel orders");
  }
  const { orderId } = req.params;
  if (!orderId) {
    throw new AppError(400, "Order ID is required");
  }
  const result = await orderService.cancelOrder(req.user.id, orderId);
  res.status(200).json({
    success: true,
    data: result
  });
});
var getAllOrdersForAdmin2 = catchAsync(async (_req, res) => {
  const result = await orderService.getAllOrdersForAdmin();
  res.status(200).json({
    success: true,
    data: result
  });
});
var updateOrderStatus2 = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }
  const { orderId } = req.params;
  const { status } = req.body;
  if (!orderId || !status) {
    throw new AppError(400, "Order ID and status are required");
  }
  const result = await orderService.updateOrderStatus(orderId, status);
  res.status(200).json({
    success: true,
    data: result
  });
});
var cancelOrderByAdmin2 = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized access");
  }
  const { orderId } = req.params;
  if (!orderId) {
    throw new AppError(400, "Order ID is required");
  }
  const result = await orderService.cancelOrderByAdmin(orderId);
  res.status(200).json({
    success: true,
    data: result
  });
});
var orderController = {
  createOrder: createOrder2,
  getMyOrders: getMyOrders2,
  getSingleOrder: getSingleOrder2,
  cancelOrder: cancelOrder2,
  getAllOrdersForAdmin: getAllOrdersForAdmin2,
  updateOrderStatus: updateOrderStatus2,
  cancelOrderByAdmin: cancelOrderByAdmin2
};

// src/modules/order/order.route.ts
var router3 = Router3();
router3.post("/orders", authMiddleware("CUSTOMER" /* customer */), orderController.createOrder);
router3.get("/orders", authMiddleware("CUSTOMER" /* customer */), orderController.getMyOrders);
router3.get("/orders/:orderId", authMiddleware("CUSTOMER" /* customer */), orderController.getSingleOrder);
router3.patch(
  "/orders/:orderId/cancel",
  authMiddleware("CUSTOMER" /* customer */),
  orderController.cancelOrder
);
router3.get("/admin/orders", authMiddleware("ADMIN" /* admin */), orderController.getAllOrdersForAdmin);
router3.patch(
  "/admin/orders/:orderId/status",
  authMiddleware("ADMIN" /* admin */),
  orderController.updateOrderStatus
);
router3.patch(
  "/admin/orders/:orderId/cancel",
  authMiddleware("ADMIN" /* admin */),
  orderController.cancelOrderByAdmin
);
var orderRoute = router3;

// src/modules/provider/provider.route.ts
import { Router as Router4 } from "express";

// src/modules/provider/provider.service.ts
var createProvider = async (id) => {
  if (!id) {
    throw new AppError(401, "Unauthorized access");
  }
  const user = await prisma.user.findFirst({
    where: { id }
  });
  if (!user) {
    throw new AppError(404, "Provider profile not found");
  }
  const result = await prisma.providerProfile.create({
    data: {
      userId: user.id,
      isOpen: true,
      restaurantName: "",
      description: "",
      address: "",
      phone: ""
    }
  });
  return result;
};
var getAllProviders = async () => {
  const result = await prisma.providerProfile.findMany({
    where: {
      isOpen: true,
      user: {
        status: "ACTIVE"
      }
    }
  });
  return result;
};
var getMyProfile = async (userId) => {
  if (!userId) {
    throw new AppError(401, "Unauthorized access");
  }
  const profile = await prisma.providerProfile.findFirst({
    where: {
      userId,
      user: {
        status: "ACTIVE"
      }
    }
  });
  if (!profile) {
    throw new AppError(404, "Provider profile not found");
  }
  return profile;
};
var updateMyProfile = async (userId, data) => {
  if (!userId) {
    throw new AppError(401, "Unauthorized access");
  }
  const profile = await prisma.providerProfile.findFirst({
    where: { userId }
  });
  if (!profile) {
    throw new AppError(404, "Provider profile not found");
  }
  const updated = await prisma.providerProfile.update({
    where: {
      id: profile.id
    },
    data
  });
  return updated;
};
var getProviderProfileWithMeals = async (providerId) => {
  if (!providerId) {
    throw new AppError(400, "Provider ID is required");
  }
  const provider = await prisma.providerProfile.findFirst({
    where: {
      id: providerId,
      isOpen: true,
      user: {
        status: "ACTIVE"
      }
    },
    include: {
      meals: {
        where: {
          isAvailable: true
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });
  if (!provider) {
    throw new AppError(404, "Provider not found or not available");
  }
  return provider;
};
var getIncomingOrders = async (providerId) => {
  if (!providerId) {
    throw new AppError(400, "Provider ID is required");
  }
  return prisma.order.findMany({
    where: {
      providerId,
      status: {
        in: [OrderStatus.PLACED, OrderStatus.PREPARING, OrderStatus.READY]
      }
    },
    include: {
      items: {
        include: { meal: true }
      },
      customer: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getProviderAllOrders = async (providerId) => {
  if (!providerId) {
    throw new AppError(400, "Provider ID is required");
  }
  return prisma.order.findMany({
    where: {
      providerId,
      status: {
        in: [OrderStatus.CANCELLED, OrderStatus.DELIVERED]
      }
    },
    include: {
      items: {
        include: { meal: true }
      },
      customer: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var updateMeal = async (providerId, mealId, data) => {
  if (!providerId || !mealId) {
    throw new AppError(400, "Provider ID and Meal ID are required");
  }
  const meal = await prisma.meal.findFirst({
    where: {
      id: mealId,
      providerId
    }
  });
  if (!meal) {
    throw new AppError(404, "Meal not found or unauthorized");
  }
  return prisma.meal.update({
    where: { id: mealId },
    data
  });
};
var deleteMeal = async (providerId, mealId) => {
  if (!providerId || !mealId) {
    throw new AppError(400, "Provider ID and Meal ID are required");
  }
  const meal = await prisma.meal.findFirst({
    where: {
      id: mealId,
      providerId
    }
  });
  if (!meal) {
    throw new AppError(404, "Meal not found or unauthorized");
  }
  return prisma.meal.delete({
    where: { id: mealId }
  });
};
var updateOrderStatus3 = async (providerId, orderId, newStatus) => {
  if (!providerId || !orderId) {
    throw new AppError(400, "Provider ID and Order ID are required");
  }
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      providerId
    }
  });
  if (!order) {
    throw new AppError(404, "Order not found or unauthorized");
  }
  if (order.status === newStatus) {
    throw new AppError(400, "Order status already updated");
  }
  const validTransitions = {
    PLACED: [OrderStatus.PREPARING],
    PREPARING: [OrderStatus.READY],
    READY: [OrderStatus.DELIVERED],
    DELIVERED: [],
    CANCELLED: []
  };
  if (!validTransitions[order.status].includes(newStatus)) {
    throw new AppError(400, "Invalid order status transition");
  }
  return prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus }
  });
};
var providerService = {
  createProvider,
  getAllProviders,
  getMyProfile,
  updateMyProfile,
  getProviderProfileWithMeals,
  updateMeal,
  deleteMeal,
  getIncomingOrders,
  updateOrderStatus: updateOrderStatus3,
  getProviderAllOrders
};

// src/modules/provider/provider.controller.ts
var createProvider2 = catchAsync(async (req, res) => {
  const result = await providerService.createProvider(req.body);
  res.status(200).json({
    success: true,
    data: result
  });
});
var getAllProviders2 = catchAsync(async (req, res) => {
  const result = await providerService.getAllProviders();
  res.status(200).json({
    success: true,
    data: result
  });
});
var getMyProfile2 = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }
  const result = await providerService.getMyProfile(req.user.id);
  res.status(200).json({
    success: true,
    data: result
  });
});
var updateMyProfile2 = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }
  if (req.user.role !== UserRole.PROVIDER) {
    throw new AppError(403, "Only providers can update profile");
  }
  const result = await providerService.updateMyProfile(req.user.id, req.body);
  res.status(200).json({
    success: true,
    data: result
  });
});
var getProviderProfileWithMeals2 = catchAsync(async (req, res) => {
  const { providerId } = req.params;
  if (!providerId) {
    throw new AppError(400, "Provider ID is required");
  }
  const result = await providerService.getProviderProfileWithMeals(providerId);
  res.status(200).json({
    success: true,
    data: result
  });
});
var getIncomingOrders2 = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }
  if (req.user.role !== UserRole.PROVIDER) {
    throw new AppError(403, "Only providers can view orders");
  }
  const provider = await prisma.providerProfile.findFirst({
    where: { userId: req.user.id }
  });
  if (!provider) {
    throw new AppError(404, "Provider profile not found");
  }
  const result = await providerService.getIncomingOrders(provider.id);
  res.status(200).json({
    success: true,
    data: result
  });
});
var getProviderAllOrders2 = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }
  if (req.user.role !== UserRole.PROVIDER) {
    throw new AppError(403, "Only providers can view orders");
  }
  const provider = await prisma.providerProfile.findFirst({
    where: { userId: req.user.id }
  });
  if (!provider) {
    throw new AppError(404, "Provider profile not found");
  }
  const result = await providerService.getProviderAllOrders(provider.id);
  res.status(200).json({
    success: true,
    data: result
  });
});
var updateOrderStatus4 = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }
  if (req.user.role !== UserRole.PROVIDER) {
    throw new AppError(403, "Only providers can update order status");
  }
  const { orderId } = req.params;
  const { status } = req.body;
  if (!orderId || !status) {
    throw new AppError(400, "Order ID and status are required");
  }
  const provider = await prisma.providerProfile.findFirst({
    where: { userId: req.user.id }
  });
  if (!provider) {
    throw new AppError(404, "Provider profile not found");
  }
  const result = await providerService.updateOrderStatus(provider.id, orderId, status);
  res.status(200).json({
    success: true,
    data: result
  });
});
var updateMeal2 = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }
  if (req.user.role !== UserRole.PROVIDER) {
    throw new AppError(403, "Only providers can update meals");
  }
  const { mealId } = req.params;
  if (!mealId) {
    throw new AppError(400, "Meal ID is required");
  }
  const provider = await prisma.providerProfile.findFirst({
    where: { userId: req.user.id }
  });
  if (!provider) {
    throw new AppError(404, "Provider profile not found");
  }
  const result = await providerService.updateMeal(provider.id, mealId, req.body);
  res.status(200).json({
    success: true,
    data: result
  });
});
var deleteMeal2 = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }
  if (req.user.role !== UserRole.PROVIDER) {
    throw new AppError(403, "Only providers can delete meals");
  }
  const { mealId } = req.params;
  if (!mealId) {
    throw new AppError(400, "Meal ID is required");
  }
  const provider = await prisma.providerProfile.findFirst({
    where: { userId: req.user.id }
  });
  if (!provider) {
    throw new AppError(404, "Provider profile not found");
  }
  const result = await providerService.deleteMeal(provider.id, mealId);
  res.status(200).json({
    success: true,
    data: result
  });
});
var providerController = {
  createProvider: createProvider2,
  getAllProviders: getAllProviders2,
  getMyProfile: getMyProfile2,
  updateMyProfile: updateMyProfile2,
  getProviderProfileWithMeals: getProviderProfileWithMeals2,
  updateMeal: updateMeal2,
  deleteMeal: deleteMeal2,
  getIncomingOrders: getIncomingOrders2,
  updateOrderStatus: updateOrderStatus4,
  getProviderAllOrders: getProviderAllOrders2
};

// src/modules/provider/provider.route.ts
var router4 = Router4();
router4.post("/providers", providerController.createProvider);
router4.get("/providers", providerController.getAllProviders);
router4.get("/provider/me", authMiddleware("PROVIDER" /* provider */), providerController.getMyProfile);
router4.get("/providers/:providerId", providerController.getProviderProfileWithMeals);
router4.get(
  "/provider/orders",
  authMiddleware("PROVIDER" /* provider */),
  providerController.getIncomingOrders
);
router4.get(
  "/provider/all-orders",
  authMiddleware("PROVIDER" /* provider */),
  providerController.getProviderAllOrders
);
router4.patch(
  "/provider/meals/:mealId",
  authMiddleware("PROVIDER" /* provider */),
  providerController.updateMeal
);
router4.patch("/provider/me", authMiddleware("PROVIDER" /* provider */), providerController.updateMyProfile);
router4.patch(
  "/provider/orders/:orderId/status",
  authMiddleware("PROVIDER" /* provider */),
  providerController.updateOrderStatus
);
router4.delete(
  "/provider/meals/:mealId",
  authMiddleware("PROVIDER" /* provider */),
  providerController.deleteMeal
);
var providerRoute = router4;

// src/modules/review/review.route.ts
import { Router as Router5 } from "express";

// src/modules/review/review.service.ts
var createReview = async (customerId, payload) => {
  const order = await prisma.order.findFirst({
    where: {
      id: payload.orderId,
      customerId
    },
    include: {
      items: true
    }
  });
  if (!order) {
    throw new AppError(404, "Order not found");
  }
  if (order.status !== OrderStatus.DELIVERED) {
    throw new AppError(400, "You can only review delivered orders");
  }
  const mealInOrder = order.items.find((item) => item.mealId === payload.mealId);
  if (!mealInOrder) {
    throw new AppError(400, "Meal not found in this order");
  }
  const existingReview = await prisma.review.findUnique({
    where: {
      orderId: payload.orderId
    }
  });
  if (existingReview) {
    throw new AppError(409, "Review already submitted for this order");
  }
  const review = await prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment ?? null,
      orderId: payload.orderId,
      mealId: payload.mealId,
      customerId
    }
  });
  return review;
};
var getReviewsByMeal = async (mealId) => {
  const reviews = await prisma.review.findMany({
    where: {
      mealId
    },
    include: {
      customer: {
        select: {
          name: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const aggregate = await prisma.review.aggregate({
    where: { mealId },
    _avg: {
      rating: true
    },
    _count: {
      rating: true
    }
  });
  return {
    reviews,
    stats: {
      averageRating: aggregate._avg.rating || 0,
      totalReviews: aggregate._count.rating || 0
    }
  };
};
var reviewService = {
  createReview,
  getReviewsByMeal
};

// src/modules/review/review.controller.ts
var createReview2 = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized access");
  }
  if (req.user.role !== UserRole.CUSTOMER) {
    throw new AppError(403, "Only customers can leave reviews");
  }
  const result = await reviewService.createReview(req.user.id, req.body);
  res.status(201).json({
    success: true,
    data: result
  });
});
var getReviewsByMeal2 = catchAsync(async (req, res) => {
  const { mealId } = req.params;
  const result = await reviewService.getReviewsByMeal(mealId);
  res.status(200).json({
    success: true,
    message: "Reviews fetched successfully",
    data: result
  });
});
var reviewController = {
  createReview: createReview2,
  getReviewsByMeal: getReviewsByMeal2
};

// src/modules/review/review.route.ts
var router5 = Router5();
router5.get("/meal/:mealId", reviewController.getReviewsByMeal);
router5.post("/reviews", authMiddleware("CUSTOMER" /* customer */), reviewController.createReview);
var reviewRoute = router5;

// src/modules/user/user.route.ts
import { Router as Router6 } from "express";

// src/modules/user/user.service.ts
var getMyProfile3 = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true
    }
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
};
var updateMyProfile3 = async (userId, data) => {
  const allowedFields = ["name", "image", "phone"];
  const updateData = {};
  for (const key of allowedFields) {
    if (data[key] !== void 0) {
      updateData[key] = data[key];
    }
  }
  return prisma.user.update({
    where: { id: userId },
    data: updateData
  });
};
var getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true
    },
    where: {
      role: {
        in: ["CUSTOMER", "PROVIDER"]
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var updateUserStatus = async (userId, status) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  if (user.role === "ADMIN") {
    throw new AppError(403, "Admin status cannot be changed");
  }
  return prisma.user.update({
    where: { id: userId },
    data: { status }
  });
};
var updateUserRoleToProvider = async (userId, role) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  if (role === UserRole.PROVIDER) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: UserRole.PROVIDER
      }
    });
    return updatedUser;
  }
};
var userService = {
  getMyProfile: getMyProfile3,
  updateMyProfile: updateMyProfile3,
  getAllUsers,
  updateUserStatus,
  updateUserRoleToProvider
};

// src/modules/user/user.controller.ts
var getMyProfile4 = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized access");
  }
  const result = await userService.getMyProfile(req.user.id);
  res.status(200).json({
    success: true,
    data: result
  });
});
var updateMyProfile4 = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized access");
  }
  const result = await userService.updateMyProfile(req.user.id, req.body);
  res.status(200).json({
    success: true,
    data: result
  });
});
var getAllUsers2 = catchAsync(async (_req, res) => {
  const result = await userService.getAllUsers();
  res.status(200).json({
    success: true,
    data: result
  });
});
var updateUserStatus2 = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;
  if (!status || !["ACTIVE", "SUSPENDED"].includes(status)) {
    throw new AppError(400, "Invalid status value");
  }
  const result = await userService.updateUserStatus(userId, status);
  res.status(200).json({
    success: true,
    data: result
  });
});
var updateUserRoleToProvider2 = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  if (role === "PROVIDER" /* provider */) {
    const result = await userService.updateUserRoleToProvider(userId, role);
    res.status(200).json({
      success: true,
      message: "Provider created successfully!",
      data: result
    });
  }
});
var userController = {
  getMyProfile: getMyProfile4,
  updateMyProfile: updateMyProfile4,
  getAllUsers: getAllUsers2,
  updateUserStatus: updateUserStatus2,
  updateUserRoleToProvider: updateUserRoleToProvider2
};

// src/modules/user/user.route.ts
var router6 = Router6();
router6.get("/users/me", authMiddleware(), userController.getMyProfile);
router6.patch("/users/me", authMiddleware(), userController.updateMyProfile);
router6.patch("/users/:userId/role", userController.updateUserRoleToProvider);
router6.get("/users/admin/users", authMiddleware("ADMIN" /* admin */), userController.getAllUsers);
router6.patch(
  "/users/admin/users/:userId/status",
  authMiddleware("ADMIN" /* admin */),
  userController.updateUserStatus
);
var userRoute = router6;

// src/app.ts
var app = express();
var allowedOrigins = [
  process.env.APP_URL || "http://localhost:4000",
  process.env.PROD_APP_URL,
  // Production frontend URL
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:5000"
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) || /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
  })
);
app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api", mealRoute);
app.use("/api", categoryRoute);
app.use("/api", providerRoute);
app.use("/api", orderRoute);
app.use("/api", reviewRoute);
app.use("/api", userRoute);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use(notFoundHandler_default);
app.use(globalErrorHandler_default);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};

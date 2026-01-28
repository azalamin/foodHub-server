-- DropForeignKey
ALTER TABLE "meal" DROP CONSTRAINT "meal_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "meal" DROP CONSTRAINT "meal_providerId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_customerId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_providerId_fkey";

-- DropForeignKey
ALTER TABLE "order-item" DROP CONSTRAINT "order-item_mealId_fkey";

-- DropForeignKey
ALTER TABLE "order-item" DROP CONSTRAINT "order-item_orderId_fkey";

-- DropForeignKey
ALTER TABLE "provider-profile" DROP CONSTRAINT "provider-profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_customerId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_mealId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_orderId_fkey";

-- AddForeignKey
ALTER TABLE "meal" ADD CONSTRAINT "meal_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "provider-profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal" ADD CONSTRAINT "meal_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order-item" ADD CONSTRAINT "order-item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order-item" ADD CONSTRAINT "order-item_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "provider-profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider-profile" ADD CONSTRAINT "provider-profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

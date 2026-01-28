-- CreateEnum
CREATE TYPE "DietaryType" AS ENUM ('NONE', 'VEGETARIAN', 'VEGAN', 'HALAL', 'GLUTEN_FREE');

-- AlterTable
ALTER TABLE "meal" ADD COLUMN     "dietaryType" "DietaryType" NOT NULL DEFAULT 'NONE';

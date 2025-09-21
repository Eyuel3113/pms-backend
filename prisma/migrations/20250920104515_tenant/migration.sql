/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Tenant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `Tenant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."LeaseStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'TERMINATED');

-- DropForeignKey
ALTER TABLE "public"."Tenant" DROP CONSTRAINT "Tenant_propertyId_fkey";

-- DropIndex
DROP INDEX "public"."Tenant_email_key";

-- AlterTable
ALTER TABLE "public"."Lease" ADD COLUMN     "deposit" DOUBLE PRECISION,
ADD COLUMN     "status" "public"."LeaseStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "public"."Tenant" DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phone",
DROP COLUMN "updatedAt",
ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "propertyId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_userId_key" ON "public"."Tenant"("userId");

-- AddForeignKey
ALTER TABLE "public"."Tenant" ADD CONSTRAINT "Tenant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tenant" ADD CONSTRAINT "Tenant_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tenant" ADD CONSTRAINT "Tenant_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

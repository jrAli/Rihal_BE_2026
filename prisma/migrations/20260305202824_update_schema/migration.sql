/*
  Warnings:

  - You are about to drop the column `updateAt` on the `Appointment` table. All the data in the column will be lost.
  - The `metadata` column on the `AuditLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `location` on the `Branch` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Branch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Branch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isActive` to the `Branch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timezone` to the `Branch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isActive` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `ServiceType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationMin` to the `ServiceType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isActive` to the `ServiceType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isActive` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_branchID_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "updateAt",
ADD COLUMN     "attachPath" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "AuditLog" ALTER COLUMN "branchID" DROP NOT NULL,
DROP COLUMN "metadata",
ADD COLUMN     "metadata" JSONB,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Branch" DROP COLUMN "location",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL,
ADD COLUMN     "timezone" TEXT NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "isActive" BOOLEAN NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ServiceType" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "durationMin" INTEGER NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Slot" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "isActive" BOOLEAN NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "staffServiceType" (
    "id" TEXT NOT NULL,
    "staffID" TEXT NOT NULL,
    "ServiceTypeID" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staffServiceType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_username_key" ON "Customer"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_username_key" ON "Staff"("username");

-- AddForeignKey
ALTER TABLE "staffServiceType" ADD CONSTRAINT "staffServiceType_staffID_fkey" FOREIGN KEY ("staffID") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staffServiceType" ADD CONSTRAINT "staffServiceType_ServiceTypeID_fkey" FOREIGN KEY ("ServiceTypeID") REFERENCES "ServiceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_branchID_fkey" FOREIGN KEY ("branchID") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

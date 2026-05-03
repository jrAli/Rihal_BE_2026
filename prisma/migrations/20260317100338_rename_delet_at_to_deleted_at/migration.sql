/*
  Warnings:

  - You are about to rename the column `deleteAt` on the `Slot` table. 

*/
-- AlterTable
ALTER TABLE "Slot" RENAME COLUMN "deleteAt" TO "deleted_at";

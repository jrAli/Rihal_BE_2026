/*
  Warnings:

  - A unique constraint covering the columns `[staffID,ServiceTypeID]` on the table `staffServiceType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serviceTypeID` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "serviceTypeID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Slot" ADD COLUMN     "capacity" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "staffServiceType_staffID_ServiceTypeID_key" ON "staffServiceType"("staffID", "ServiceTypeID");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_serviceTypeID_fkey" FOREIGN KEY ("serviceTypeID") REFERENCES "ServiceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

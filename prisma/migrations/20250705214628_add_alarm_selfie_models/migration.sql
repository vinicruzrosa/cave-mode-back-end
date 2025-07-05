/*
  Warnings:

  - Added the required column `updatedAt` to the `Alarm` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AlarmRepeat" AS ENUM ('once', 'daily', 'weekly');

-- AlterTable
ALTER TABLE "Alarm" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "repeat" "AlarmRepeat" NOT NULL DEFAULT 'once',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Selfie" (
    "id" SERIAL NOT NULL,
    "alarmId" INTEGER NOT NULL,
    "imagePath" TEXT NOT NULL,
    "brightness" DOUBLE PRECISION NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Selfie_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Selfie" ADD CONSTRAINT "Selfie_alarmId_fkey" FOREIGN KEY ("alarmId") REFERENCES "Alarm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

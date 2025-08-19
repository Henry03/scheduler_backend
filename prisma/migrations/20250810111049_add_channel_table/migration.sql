/*
  Warnings:

  - You are about to drop the column `repeat` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `repeatInterval` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `repeatLimit` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `repeatType` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `repeatUntil` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the `RepeatExceptions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `seriesId` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ReminderType" ADD VALUE 'SECONDS';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "RepeatType" ADD VALUE 'SECONDLY';
ALTER TYPE "RepeatType" ADD VALUE 'MINUTELY';
ALTER TYPE "RepeatType" ADD VALUE 'HOURLY';

-- DropForeignKey
ALTER TABLE "RepeatExceptions" DROP CONSTRAINT "RepeatExceptions_scheduleId_fkey";

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "repeat",
DROP COLUMN "repeatInterval",
DROP COLUMN "repeatLimit",
DROP COLUMN "repeatType",
DROP COLUMN "repeatUntil",
ADD COLUMN     "seriesId" TEXT NOT NULL,
ALTER COLUMN "startTime" SET DATA TYPE TIMESTAMP,
ALTER COLUMN "endTime" SET DATA TYPE TIMESTAMP;

-- DropTable
DROP TABLE "RepeatExceptions";

-- DropEnum
DROP TYPE "ExceptionType";

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

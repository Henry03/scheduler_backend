-- CreateEnum
CREATE TYPE "ExceptionType" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('MINUTES', 'HOURS', 'DAYS');

-- CreateEnum
CREATE TYPE "RepeatType" AS ENUM ('DAILY', 'MONTHLY', 'YEARLy');

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ai" BOOLEAN NOT NULL,
    "startTime" TIMESTAMPTZ NOT NULL,
    "endTime" TIMESTAMPTZ NOT NULL,
    "repeat" BOOLEAN NOT NULL,
    "repeatType" "RepeatType",
    "repeatInterval" INTEGER,
    "repeatLimit" INTEGER,
    "repeatUntil" TIMESTAMPTZ,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL DEFAULT '',
    "scheduleId" TEXT NOT NULL,
    "type" "ReminderType" NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepeatExceptions" (
    "id" TEXT NOT NULL DEFAULT '',
    "scheduleId" TEXT NOT NULL,
    "type" "ExceptionType" NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "RepeatExceptions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepeatExceptions" ADD CONSTRAINT "RepeatExceptions_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

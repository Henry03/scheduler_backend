/*
  Warnings:

  - Added the required column `triggerAt` to the `Reminder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "triggerAt" TIMESTAMP(3) NOT NULL;

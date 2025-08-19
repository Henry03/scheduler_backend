/*
  Warnings:

  - You are about to drop the column `scheduleId` on the `Tag` table. All the data in the column will be lost.
  - Added the required column `tagId` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_scheduleId_fkey";

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "tagId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "scheduleId";

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

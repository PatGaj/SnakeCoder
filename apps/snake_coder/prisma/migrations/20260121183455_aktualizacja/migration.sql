/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `ResearchSurvey` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `ResearchSurvey` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "ResearchSurvey_userId_createdAt_idx";

-- AlterTable
ALTER TABLE "ResearchSurvey" ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ResearchSurvey_userId_key" ON "ResearchSurvey"("userId");

-- CreateIndex
CREATE INDEX "ResearchSurvey_createdAt_idx" ON "ResearchSurvey"("createdAt");

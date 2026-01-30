/*
  Warnings:

  - The values [SKILL_TEST] on the enum `MissionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `ExperimentAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExperimentResult` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskTestCase` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MissionType_new" AS ENUM ('TASK', 'BUGFIX', 'QUIZ', 'ARTICLE');
ALTER TABLE "Mission" ALTER COLUMN "type" TYPE "MissionType_new" USING ("type"::text::"MissionType_new");
ALTER TYPE "MissionType" RENAME TO "MissionType_old";
ALTER TYPE "MissionType_new" RENAME TO "MissionType";
DROP TYPE "public"."MissionType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "TaskTestCase" DROP CONSTRAINT "TaskTestCase_taskId_fkey";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "tests" JSONB;

-- DropTable
DROP TABLE "ExperimentAssignment";

-- DropTable
DROP TABLE "ExperimentResult";

-- DropTable
DROP TABLE "TaskTestCase";

-- CreateTable
CREATE TABLE "UserDailyLogin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "loginDate" TIMESTAMP(3) NOT NULL,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserDailyLogin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserDailyLogin_loginDate_idx" ON "UserDailyLogin"("loginDate");

-- CreateIndex
CREATE UNIQUE INDEX "UserDailyLogin_userId_loginDate_key" ON "UserDailyLogin"("userId", "loginDate");

-- AddForeignKey
ALTER TABLE "UserDailyLogin" ADD CONSTRAINT "UserDailyLogin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

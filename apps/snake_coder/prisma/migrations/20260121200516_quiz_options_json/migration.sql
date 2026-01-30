/*
  Warnings:

  - You are about to drop the `Opinion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuizOption` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `options` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Opinion" DROP CONSTRAINT "Opinion_authorId_fkey";

-- DropForeignKey
ALTER TABLE "QuizOption" DROP CONSTRAINT "QuizOption_questionId_fkey";

-- AlterTable
ALTER TABLE "QuizQuestion" ADD COLUMN     "options" JSONB NOT NULL;

-- DropTable
DROP TABLE "Opinion";

-- DropTable
DROP TABLE "QuizOption";

/*
  Warnings:

  - You are about to drop the `QuizQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResearchSurvey` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "QuizQuestion" DROP CONSTRAINT "QuizQuestion_quizId_fkey";

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "questions" JSONB NOT NULL DEFAULT '[]';

-- DropTable
DROP TABLE "QuizQuestion";

-- DropTable
DROP TABLE "ResearchSurvey";

-- CreateEnum
CREATE TYPE "ModuleCategory" AS ENUM ('CERTIFICATIONS', 'LIBRARIES', 'FRAMEWORKS');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "MissionType" AS ENUM ('TASK', 'BUGFIX', 'QUIZ', 'ARTICLE', 'SKILL_TEST');

-- CreateEnum
CREATE TYPE "MissionProgressStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "TaskSubmissionStatus" AS ENUM ('PENDING', 'PASSED', 'FAILED', 'ERROR');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gradeAvg" DOUBLE PRECISION,
ADD COLUMN     "streakBest" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "streakCurrent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "xpMonth" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "xpToday" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "xpTotal" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT[],
    "category" "ModuleCategory" NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "imagePath" TEXT,
    "isBuilding" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sprint" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "etaMinutes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mission" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "sprintId" TEXT,
    "type" "MissionType" NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "title" TEXT NOT NULL,
    "shortDesc" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT[],
    "hints" TEXT[],
    "etaMinutes" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL,
    "timeLimitSeconds" INTEGER,
    "passPercent" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "missionId" TEXT NOT NULL,
    "starterCode" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'python',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("missionId")
);

-- CreateTable
CREATE TABLE "TaskTestCase" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "input" TEXT NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskTestCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskSubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" "TaskSubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "passedCount" INTEGER NOT NULL DEFAULT 0,
    "totalCount" INTEGER NOT NULL DEFAULT 0,
    "stdout" TEXT,
    "aiGrade" TEXT,
    "aiFeedback" TEXT,
    "timeSpentSeconds" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "missionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("missionId")
);

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "QuizOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "score" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "percent" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "timeSpentSeconds" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "missionId" TEXT NOT NULL,
    "tags" TEXT[],
    "blocks" JSONB NOT NULL,
    "summary" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("missionId")
);

-- CreateTable
CREATE TABLE "UserMissionProgress" (
    "userId" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "status" "MissionProgressStatus" NOT NULL DEFAULT 'TODO',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "lastOpenedAt" TIMESTAMP(3),
    "xpEarned" INTEGER,
    "grade" TEXT,
    "timeSpentSeconds" INTEGER,

    CONSTRAINT "UserMissionProgress_pkey" PRIMARY KEY ("userId","missionId")
);

-- CreateTable
CREATE TABLE "UserModuleAccess" (
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "hasAccess" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "UserModuleAccess_pkey" PRIMARY KEY ("userId","moduleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Module_code_key" ON "Module"("code");

-- CreateIndex
CREATE INDEX "Sprint_moduleId_idx" ON "Sprint"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "Sprint_moduleId_order_key" ON "Sprint"("moduleId", "order");

-- CreateIndex
CREATE INDEX "Mission_moduleId_idx" ON "Mission"("moduleId");

-- CreateIndex
CREATE INDEX "Mission_sprintId_idx" ON "Mission"("sprintId");

-- CreateIndex
CREATE INDEX "Mission_type_idx" ON "Mission"("type");

-- CreateIndex
CREATE INDEX "TaskTestCase_taskId_isPublic_idx" ON "TaskTestCase"("taskId", "isPublic");

-- CreateIndex
CREATE UNIQUE INDEX "TaskTestCase_taskId_order_key" ON "TaskTestCase"("taskId", "order");

-- CreateIndex
CREATE INDEX "TaskSubmission_userId_createdAt_idx" ON "TaskSubmission"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "TaskSubmission_taskId_createdAt_idx" ON "TaskSubmission"("taskId", "createdAt");

-- CreateIndex
CREATE INDEX "QuizQuestion_quizId_idx" ON "QuizQuestion"("quizId");

-- CreateIndex
CREATE UNIQUE INDEX "QuizQuestion_quizId_order_key" ON "QuizQuestion"("quizId", "order");

-- CreateIndex
CREATE INDEX "QuizOption_questionId_idx" ON "QuizOption"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "QuizOption_questionId_order_key" ON "QuizOption"("questionId", "order");

-- CreateIndex
CREATE INDEX "QuizAttempt_userId_createdAt_idx" ON "QuizAttempt"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "QuizAttempt_quizId_createdAt_idx" ON "QuizAttempt"("quizId", "createdAt");

-- CreateIndex
CREATE INDEX "UserMissionProgress_userId_status_idx" ON "UserMissionProgress"("userId", "status");

-- CreateIndex
CREATE INDEX "UserMissionProgress_missionId_idx" ON "UserMissionProgress"("missionId");

-- CreateIndex
CREATE INDEX "UserModuleAccess_moduleId_idx" ON "UserModuleAccess"("moduleId");

-- AddForeignKey
ALTER TABLE "Sprint" ADD CONSTRAINT "Sprint_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskTestCase" ADD CONSTRAINT "TaskTestCase_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("missionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskSubmission" ADD CONSTRAINT "TaskSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskSubmission" ADD CONSTRAINT "TaskSubmission_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("missionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("missionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizOption" ADD CONSTRAINT "QuizOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("missionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMissionProgress" ADD CONSTRAINT "UserMissionProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMissionProgress" ADD CONSTRAINT "UserMissionProgress_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserModuleAccess" ADD CONSTRAINT "UserModuleAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserModuleAccess" ADD CONSTRAINT "UserModuleAccess_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

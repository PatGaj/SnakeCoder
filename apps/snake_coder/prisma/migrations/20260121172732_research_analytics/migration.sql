-- CreateTable
CREATE TABLE "ResearchSurvey" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "pagePath" TEXT,
    "feedbackRating" INTEGER NOT NULL,
    "clarityRating" INTEGER NOT NULL,
    "difficultyRating" INTEGER NOT NULL,
    "overallRating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResearchSurvey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsLog" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "missionId" TEXT,
    "missionType" TEXT,
    "xpAwarded" INTEGER,
    "timeSpentSeconds" INTEGER,
    "attemptsCount" INTEGER,
    "streakCurrent" INTEGER,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperimentAssignment" (
    "id" TEXT NOT NULL,
    "experimentKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "variant" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExperimentAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperimentResult" (
    "id" TEXT NOT NULL,
    "experimentKey" TEXT NOT NULL,
    "userId" TEXT,
    "variant" TEXT NOT NULL,
    "missionId" TEXT,
    "missionType" TEXT,
    "passed" BOOLEAN,
    "xpAwarded" INTEGER,
    "timeSpentSeconds" INTEGER,
    "attemptsCount" INTEGER,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExperimentResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ResearchSurvey_userId_createdAt_idx" ON "ResearchSurvey"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsLog_event_createdAt_idx" ON "AnalyticsLog"("event", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsLog_userId_createdAt_idx" ON "AnalyticsLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ExperimentAssignment_experimentKey_variant_idx" ON "ExperimentAssignment"("experimentKey", "variant");

-- CreateIndex
CREATE UNIQUE INDEX "ExperimentAssignment_experimentKey_userId_key" ON "ExperimentAssignment"("experimentKey", "userId");

-- CreateIndex
CREATE INDEX "ExperimentResult_experimentKey_variant_idx" ON "ExperimentResult"("experimentKey", "variant");

-- CreateIndex
CREATE INDEX "ExperimentResult_userId_createdAt_idx" ON "ExperimentResult"("userId", "createdAt");

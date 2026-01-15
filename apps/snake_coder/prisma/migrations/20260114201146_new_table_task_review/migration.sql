-- CreateTable
CREATE TABLE "TaskReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "model" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaskReview_userId_createdAt_idx" ON "TaskReview"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "TaskReview_taskId_createdAt_idx" ON "TaskReview"("taskId", "createdAt");

-- AddForeignKey
ALTER TABLE "TaskReview" ADD CONSTRAINT "TaskReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskReview" ADD CONSTRAINT "TaskReview_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("missionId") ON DELETE CASCADE ON UPDATE CASCADE;

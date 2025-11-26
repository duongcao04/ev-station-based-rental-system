-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'PROMOTION';

-- CreateTable
CREATE TABLE "CronJobSetting" (
    "id" TEXT NOT NULL,
    "jobName" TEXT NOT NULL,
    "cronTime" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CronJobSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CronJobSetting_jobName_key" ON "CronJobSetting"("jobName");

-- CreateEnum
CREATE TYPE "OkrStatus" AS ENUM ('achieved', 'on_track', 'delayed', 'okr_under_review', 'at_risk');

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('not_started', 'in_progress', 'completed');

-- CreateEnum
CREATE TYPE "MeasurementUnit" AS ENUM ('percent', 'number', 'currency', 'counties', 'yes_no');

-- CreateEnum
CREATE TYPE "CalculationMethod" AS ENUM ('latest', 'cumulative', 'average');

-- CreateEnum
CREATE TYPE "MetricType" AS ENUM ('percentage', 'binary', 'count', 'yes_no');

-- CreateEnum
CREATE TYPE "ChartType" AS ENUM ('bar', 'line', 'pie', 'geomap', 'yes_no');

-- CreateEnum
CREATE TYPE "ConfidenceLevel" AS ENUM ('low', 'medium', 'high');

-- CreateTable
CREATE TABLE "Okr" (
    "id" TEXT NOT NULL,
    "okrId" TEXT NOT NULL,
    "objectiveToc" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "keyResult" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "status" "OkrStatus" NOT NULL,
    "progress" INTEGER NOT NULL,
    "confidenceLevel" "ConfidenceLevel" NOT NULL,
    "unit" "MeasurementUnit" NOT NULL,
    "baseline" DOUBLE PRECISION NOT NULL,
    "targetValue" DOUBLE PRECISION NOT NULL,
    "minValue" DOUBLE PRECISION,
    "maxValue" DOUBLE PRECISION,
    "calculationMethod" "CalculationMethod" NOT NULL,
    "valuePrompt" TEXT,
    "valueHint" TEXT,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "chartMetricType" "MetricType" NOT NULL,
    "chartType" "ChartType" NOT NULL,
    "chartMetricUnit" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" TIMESTAMP(3),
    "archivedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Okr_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "milestone" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "MilestoneStatus" NOT NULL,
    "completionDate" TIMESTAMP(3),
    "okrId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyUpdate" (
    "id" TEXT NOT NULL,
    "value" DOUBLE PRECISION,
    "narrative" TEXT NOT NULL,
    "status" "OkrStatus" NOT NULL,
    "risks" TEXT[],
    "mitigations" TEXT[],
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "okrId" TEXT NOT NULL,
    "createdByEmail" TEXT,
    "updatedByEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Okr_okrId_key" ON "Okr"("okrId");

-- CreateIndex
CREATE INDEX "Okr_okrId_idx" ON "Okr"("okrId");

-- CreateIndex
CREATE INDEX "Okr_objectiveToc_idx" ON "Okr"("objectiveToc");

-- CreateIndex
CREATE INDEX "Okr_status_idx" ON "Okr"("status");

-- CreateIndex
CREATE INDEX "Okr_archived_idx" ON "Okr"("archived");

-- CreateIndex
CREATE INDEX "Okr_periodStart_idx" ON "Okr"("periodStart");

-- CreateIndex
CREATE INDEX "Okr_periodEnd_idx" ON "Okr"("periodEnd");

-- CreateIndex
CREATE INDEX "Okr_archived_status_idx" ON "Okr"("archived", "status");

-- CreateIndex
CREATE INDEX "Milestone_okrId_idx" ON "Milestone"("okrId");

-- CreateIndex
CREATE INDEX "Milestone_status_idx" ON "Milestone"("status");

-- CreateIndex
CREATE INDEX "Milestone_dueDate_idx" ON "Milestone"("dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "Milestone_okrId_milestone_key" ON "Milestone"("okrId", "milestone");

-- CreateIndex
CREATE INDEX "MonthlyUpdate_okrId_idx" ON "MonthlyUpdate"("okrId");

-- CreateIndex
CREATE INDEX "MonthlyUpdate_month_year_idx" ON "MonthlyUpdate"("month", "year");

-- CreateIndex
CREATE INDEX "MonthlyUpdate_year_idx" ON "MonthlyUpdate"("year");

-- CreateIndex
CREATE INDEX "MonthlyUpdate_status_idx" ON "MonthlyUpdate"("status");

-- CreateIndex
CREATE INDEX "MonthlyUpdate_createdByEmail_idx" ON "MonthlyUpdate"("createdByEmail");

-- CreateIndex
CREATE INDEX "MonthlyUpdate_updatedByEmail_idx" ON "MonthlyUpdate"("updatedByEmail");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyUpdate_okrId_month_year_key" ON "MonthlyUpdate"("okrId", "month", "year");

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_okrId_fkey" FOREIGN KEY ("okrId") REFERENCES "Okr"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyUpdate" ADD CONSTRAINT "MonthlyUpdate_okrId_fkey" FOREIGN KEY ("okrId") REFERENCES "Okr"("id") ON DELETE CASCADE ON UPDATE CASCADE;

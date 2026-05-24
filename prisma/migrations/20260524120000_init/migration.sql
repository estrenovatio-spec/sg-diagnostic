-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED_NO_KIDS', 'MARRIED_WITH_KIDS');

-- CreateEnum
CREATE TYPE "IncomeLevel" AS ENUM ('UNDER_150K', 'FROM_150K_TO_250K', 'FROM_250K_TO_400K', 'FROM_400K_TO_700K', 'OVER_700K');

-- CreateEnum
CREATE TYPE "StabilityLevel" AS ENUM ('STABLE', 'FLUCTUATING', 'UNSTABLE');

-- CreateEnum
CREATE TYPE "DebtLevel" AS ENUM ('NO_DEBTS', 'UP_TO_500K', 'FROM_500K_TO_2M', 'OVER_2M');

-- CreateEnum
CREATE TYPE "SavingsLevel" AS ENUM ('NO_SAVINGS', 'UP_TO_300K', 'FROM_300K_TO_1M', 'FROM_1M_TO_5M', 'OVER_5M');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('NONE', 'CASH_DEPOSITS', 'BROKERAGE_IIS', 'INSURANCE_NSZH_ISZH', 'REAL_ESTATE_LIVING');

-- CreateEnum
CREATE TYPE "PainPoint" AS ENUM ('NO_SAFETY_NET', 'DEBT_PRESSURE', 'MONEY_DISAPPEARS', 'FEAR_CRISIS', 'WANT_INVEST_DONT_KNOW_HOW', 'OTHER');

-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('BUILD_SAFETY_NET', 'CLOSE_DEBTS', 'START_INVESTING', 'PASSIVE_INCOME', 'INCOME_REAL_ESTATE');

-- CreateEnum
CREATE TYPE "WhyNowReason" AS ENUM ('WANT_SYSTEM', 'CANT_HANDLE_ALONE', 'BAD_EXPERIENCE_BEFORE', 'KNOWS_NEEDS_HELP', 'OTHER');

-- CreateEnum
CREATE TYPE "ReadinessLevel" AS ENUM ('READY_REGULAR', 'READY_WITH_MOTIVATION', 'HARD_TO_FOLLOW_BUT_WANT', 'UNSURE');

-- CreateEnum
CREATE TYPE "FeedbackStyle" AS ENUM ('STRICT_CONTROL', 'SOFT_SUPPORT', 'FACTS_ONLY');

-- CreateEnum
CREATE TYPE "ReserveAmount" AS ENUM ('UP_TO_10K', 'FROM_10K_TO_30K', 'FROM_30K_TO_70K', 'OVER_70K');

-- CreateEnum
CREATE TYPE "BudgetLevel" AS ENUM ('NOT_READY_PAY', 'ONE_TIME_UP_TO_30K', 'ONE_TIME_30K_100K', 'SUBSCRIPTION_100K_PLUS', 'OPEN_TO_DISCUSS');

-- CreateEnum
CREATE TYPE "Qualification" AS ENUM ('PENDING', 'HOT', 'WARM', 'COLD', 'NOT_READY');

-- CreateEnum
CREATE TYPE "NextStep" AS ENUM ('BOOK_CALL', 'SEND_MATERIALS', 'WAIT_ACCUMULATE', 'MANUAL_REVIEW');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fullName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "phone" TEXT,
    "telegram" TEXT,
    "maritalStatus" "MaritalStatus" NOT NULL,
    "profession" TEXT NOT NULL,
    "incomeLevel" "IncomeLevel" NOT NULL,
    "incomeStability" "StabilityLevel" NOT NULL,
    "hasDebts" "DebtLevel" NOT NULL,
    "hasSavings" "SavingsLevel" NOT NULL,
    "assets" "AssetType"[],
    "mainPainPoint" "PainPoint" NOT NULL,
    "painPointOther" TEXT,
    "goals35years" "GoalType"[],
    "triedBefore" TEXT,
    "mistakes" TEXT,
    "whyNow" "WhyNowReason" NOT NULL,
    "readinessLevel" "ReadinessLevel" NOT NULL,
    "feedbackStyle" "FeedbackStyle" NOT NULL,
    "monthlyReserve" "ReserveAmount" NOT NULL,
    "advisorBudget" "BudgetLevel" NOT NULL,
    "rulesAccepted" BOOLEAN NOT NULL DEFAULT false,
    "pdConsent" BOOLEAN NOT NULL DEFAULT false,
    "userQuestion" TEXT,
    "qualification" "Qualification" NOT NULL DEFAULT 'PENDING',
    "nextStep" "NextStep",
    "utmSource" TEXT,
    "userAgent" TEXT,
    "ipHash" TEXT,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiReport" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "summary" TEXT NOT NULL,
    "strengths" TEXT[],
    "growthZones" TEXT[],
    "risks" TEXT[],
    "quickWins" TEXT[],
    "priorityFocus" TEXT NOT NULL,
    "investmentReadiness" BOOLEAN NOT NULL,
    "consultationRecommendation" TEXT NOT NULL,
    "rawPrompt" TEXT NOT NULL,
    "modelUsed" TEXT NOT NULL,
    "tokensUsed" INTEGER NOT NULL,

    CONSTRAINT "AiReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AiReport_leadId_key" ON "AiReport"("leadId");

-- AddForeignKey
ALTER TABLE "AiReport" ADD CONSTRAINT "AiReport_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;


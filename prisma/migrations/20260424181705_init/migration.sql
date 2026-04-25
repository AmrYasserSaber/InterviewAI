-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('JUNIOR', 'MID', 'SENIOR', 'LEAD', 'PRINCIPAL');

-- CreateEnum
CREATE TYPE "DifficultyMode" AS ENUM ('EASY', 'MEDIUM', 'HARD', 'EXPERT', 'FAANG');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('CREATED', 'APPROVED', 'CAPTURED', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "InterviewRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sessionId" TEXT,
    "ipAddress" TEXT,
    "cvHash" TEXT NOT NULL,
    "jdHash" TEXT NOT NULL,
    "inputHash" TEXT NOT NULL,
    "experienceLevel" "ExperienceLevel" NOT NULL,
    "difficultyMode" "DifficultyMode" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "promptTokens" INTEGER,
    "completionTokens" INTEGER,

    CONSTRAINT "InterviewRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requestId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "requestId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "captureId" TEXT,
    "amountUSD" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "PaymentStatus" NOT NULL DEFAULT 'CREATED',
    "webhookEventId" TEXT,
    "capturedAt" TIMESTAMP(3),

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimitRecord" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "windowStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateLimitRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InterviewRequest_inputHash_key" ON "InterviewRequest"("inputHash");

-- CreateIndex
CREATE INDEX "InterviewRequest_inputHash_idx" ON "InterviewRequest"("inputHash");

-- CreateIndex
CREATE INDEX "InterviewRequest_sessionId_idx" ON "InterviewRequest"("sessionId");

-- CreateIndex
CREATE INDEX "InterviewRequest_createdAt_idx" ON "InterviewRequest"("createdAt");

-- CreateIndex
CREATE INDEX "Question_requestId_idx" ON "Question"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "Question_requestId_position_key" ON "Question"("requestId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_requestId_key" ON "Payment"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_captureId_key" ON "Payment"("captureId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_webhookEventId_key" ON "Payment"("webhookEventId");

-- CreateIndex
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "RateLimitRecord_key_key" ON "RateLimitRecord"("key");

-- CreateIndex
CREATE INDEX "RateLimitRecord_key_idx" ON "RateLimitRecord"("key");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "InterviewRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "InterviewRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

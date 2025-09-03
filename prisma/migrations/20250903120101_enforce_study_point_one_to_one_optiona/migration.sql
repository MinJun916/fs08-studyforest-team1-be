-- CreateTable
CREATE TABLE "public"."Emoji" (
    "id" UUID NOT NULL,
    "studyId" UUID NOT NULL,
    "emojiType" VARCHAR(255),
    "count" INTEGER,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "Emoji_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Study" (
    "id" UUID NOT NULL,
    "nickName" VARCHAR(15) NOT NULL,
    "studyName" VARCHAR(40) NOT NULL,
    "description" VARCHAR(2000),
    "backgroundImg" VARCHAR(40),
    "password" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "Study_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Focus" (
    "id" UUID NOT NULL,
    "studyId" UUID NOT NULL,
    "time" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "Focus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Habit" (
    "id" UUID NOT NULL,
    "studyId" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "Habit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HabitCheck" (
    "id" UUID NOT NULL,
    "habitId" UUID NOT NULL,
    "pointId" UUID NOT NULL,
    "studyId" UUID NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "checkDate" DATE NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "HabitCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Point" (
    "id" UUID NOT NULL,
    "studyId" UUID NOT NULL,
    "point" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "Point_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Emoji_studyId_idx" ON "public"."Emoji"("studyId");

-- CreateIndex
CREATE INDEX "Focus_studyId_idx" ON "public"."Focus"("studyId");

-- CreateIndex
CREATE INDEX "Habit_studyId_idx" ON "public"."Habit"("studyId");

-- CreateIndex
CREATE INDEX "HabitCheck_studyId_idx" ON "public"."HabitCheck"("studyId");

-- CreateIndex
CREATE UNIQUE INDEX "HabitCheck_habitId_studyId_checkDate_key" ON "public"."HabitCheck"("habitId", "studyId", "checkDate");

-- CreateIndex
CREATE UNIQUE INDEX "Point_studyId_key" ON "public"."Point"("studyId");

-- CreateIndex
CREATE INDEX "Point_studyId_idx" ON "public"."Point"("studyId");

-- AddForeignKey
ALTER TABLE "public"."Emoji" ADD CONSTRAINT "Emoji_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "public"."Study"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Focus" ADD CONSTRAINT "Focus_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "public"."Study"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Habit" ADD CONSTRAINT "Habit_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "public"."Study"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HabitCheck" ADD CONSTRAINT "HabitCheck_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "public"."Habit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HabitCheck" ADD CONSTRAINT "HabitCheck_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "public"."Point"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HabitCheck" ADD CONSTRAINT "HabitCheck_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "public"."Study"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Point" ADD CONSTRAINT "Point_studyId_fkey" FOREIGN KEY ("studyId") REFERENCES "public"."Study"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

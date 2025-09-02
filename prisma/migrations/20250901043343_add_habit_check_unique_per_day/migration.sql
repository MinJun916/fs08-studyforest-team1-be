/*
  Warnings:

  - A unique constraint covering the columns `[habitId,studyId,checkDate]` on the table `HabitCheck` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HabitCheck_habitId_studyId_checkDate_key" ON "public"."HabitCheck"("habitId", "studyId", "checkDate");

/*
  Warnings:

  - A unique constraint covering the columns `[studyId]` on the table `Point` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Point_studyId_key" ON "public"."Point"("studyId");

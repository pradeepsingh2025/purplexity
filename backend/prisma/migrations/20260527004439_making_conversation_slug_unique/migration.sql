/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Converstaion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Converstaion_slug_key" ON "Converstaion"("slug");

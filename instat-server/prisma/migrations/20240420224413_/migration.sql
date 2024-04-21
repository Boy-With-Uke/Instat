/*
  Warnings:

  - A unique constraint covering the columns `[sh8]` on the table `Flux` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Flux_sh8_key` ON `Flux`(`sh8`);

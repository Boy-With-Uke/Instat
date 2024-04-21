/*
  Warnings:

  - A unique constraint covering the columns `[id_flux]` on the table `Flux` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Flux_id_flux_key` ON `Flux`(`id_flux`);

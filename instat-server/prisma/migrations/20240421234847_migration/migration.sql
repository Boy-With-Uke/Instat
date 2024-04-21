/*
  Warnings:

  - Added the required column `trimestre` to the `Flux` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Flux` ADD COLUMN `trimestre` INTEGER NOT NULL;

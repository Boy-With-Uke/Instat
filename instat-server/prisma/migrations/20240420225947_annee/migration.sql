/*
  Warnings:

  - You are about to drop the column `Annee` on the `Flux` table. All the data in the column will be lost.
  - Added the required column `annee` to the `Flux` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Flux` DROP COLUMN `Annee`,
    ADD COLUMN `annee` INTEGER NOT NULL;

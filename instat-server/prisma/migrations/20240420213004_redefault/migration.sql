/*
  Warnings:

  - Made the column `AnneeApparition` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `TrimestreApparition` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `AnneeApparition` INTEGER NOT NULL,
    MODIFY `TrimestreApparition` INTEGER NOT NULL;

/*
  Warnings:

  - Added the required column `AddingUser` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Flux` ADD COLUMN `userId_user` INTEGER NULL;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `AddingUser` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `User` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_AddingUser_fkey` FOREIGN KEY (`AddingUser`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Flux` ADD CONSTRAINT `Flux_userId_user_fkey` FOREIGN KEY (`userId_user`) REFERENCES `User`(`id_user`) ON DELETE SET NULL ON UPDATE CASCADE;

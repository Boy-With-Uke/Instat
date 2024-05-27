-- AlterTable
ALTER TABLE `Flux` ADD COLUMN `dateAjout` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `dateAjout` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `notification` (
    `id_notification` INTEGER NOT NULL AUTO_INCREMENT,
    `utilisateurAjout` INTEGER NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `typeDajout` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `notification_id_notification_key`(`id_notification`),
    PRIMARY KEY (`id_notification`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_utilisateurAjout_fkey` FOREIGN KEY (`utilisateurAjout`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE `Product` (
    `id_product` INTEGER NOT NULL AUTO_INCREMENT,
    `sh8_product` INTEGER NOT NULL,
    `sh2_product` INTEGER NOT NULL,
    `libelle_product` VARCHAR(191) NOT NULL,
    `AnneeApparition` INTEGER NOT NULL,
    `TrimestreApparition` INTEGER NOT NULL,

    UNIQUE INDEX `Product_sh8_product_key`(`sh8_product`),
    PRIMARY KEY (`id_product`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Flux` (
    `id_flux` INTEGER NOT NULL AUTO_INCREMENT,
    `sh8` INTEGER NOT NULL,
    `libelle` VARCHAR(191) NOT NULL,
    `sh2` INTEGER NOT NULL,
    `valeur` INTEGER NOT NULL,
    `poids_net` INTEGER NOT NULL,
    `quantite` INTEGER NOT NULL,
    `prix_unitaire` INTEGER NOT NULL,
    `prix_unitaire_moyenne_annuelle` INTEGER NOT NULL,

    PRIMARY KEY (`id_flux`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Flux` ADD CONSTRAINT `Flux_sh8_fkey` FOREIGN KEY (`sh8`) REFERENCES `Product`(`sh8_product`) ON DELETE RESTRICT ON UPDATE CASCADE;

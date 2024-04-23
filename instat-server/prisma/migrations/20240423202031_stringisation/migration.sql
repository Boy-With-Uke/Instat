-- DropForeignKey
ALTER TABLE `Flux` DROP FOREIGN KEY `Flux_sh8_product_id_fkey`;

-- AlterTable
ALTER TABLE `Flux` MODIFY `sh8` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Product` MODIFY `sh8_product` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Flux` ADD CONSTRAINT `Flux_sh8_product_id_fkey` FOREIGN KEY (`sh8`, `product_id`) REFERENCES `Product`(`sh8_product`, `id_product`) ON DELETE CASCADE ON UPDATE CASCADE;

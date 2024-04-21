-- DropForeignKey
ALTER TABLE `Flux` DROP FOREIGN KEY `Flux_sh8_fkey`;

-- AddForeignKey
ALTER TABLE `Flux` ADD CONSTRAINT `Flux_sh8_fkey` FOREIGN KEY (`sh8`) REFERENCES `Product`(`sh8_product`) ON DELETE CASCADE ON UPDATE CASCADE;

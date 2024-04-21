/*
  Warnings:

  - A unique constraint covering the columns `[sh8_product,id_product]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `product_id` to the `Flux` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Flux` DROP FOREIGN KEY `Flux_sh8_fkey`;

-- AlterTable
ALTER TABLE `Flux` ADD COLUMN `product_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Product_sh8_product_id_product_key` ON `Product`(`sh8_product`, `id_product`);

-- AddForeignKey
ALTER TABLE `Flux` ADD CONSTRAINT `Flux_sh8_product_id_fkey` FOREIGN KEY (`sh8`, `product_id`) REFERENCES `Product`(`sh8_product`, `id_product`) ON DELETE CASCADE ON UPDATE CASCADE;

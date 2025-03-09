/*
  Warnings:

  - You are about to drop the column `date` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `sumary` on the `Calendar` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `Calendar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Calendar` DROP COLUMN `date`,
    DROP COLUMN `sumary`,
    ADD COLUMN `endDate` DATETIME(3) NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL,
    ADD COLUMN `summary` VARCHAR(191) NOT NULL;

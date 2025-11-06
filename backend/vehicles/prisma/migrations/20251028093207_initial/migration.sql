/*
  Warnings:

  - Added the required column `displayName` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "displayName" TEXT NOT NULL,
ADD COLUMN     "sku" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

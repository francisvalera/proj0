/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Subcategory` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Subcategory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId,subcategoryId]` on the table `ProductSubcategory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."ProductSubcategory" DROP CONSTRAINT "ProductSubcategory_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductSubcategory" DROP CONSTRAINT "ProductSubcategory_subcategoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Subcategory" DROP CONSTRAINT "Subcategory_categoryId_fkey";

-- DropIndex
DROP INDEX "public"."Product_sku_key";

-- AlterTable
ALTER TABLE "public"."Category" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "size",
DROP COLUMN "sku",
ADD COLUMN     "subcategoryId" TEXT;

-- AlterTable
ALTER TABLE "public"."Subcategory" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- CreateIndex
CREATE UNIQUE INDEX "ProductSubcategory_productId_subcategoryId_key" ON "public"."ProductSubcategory"("productId", "subcategoryId");

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "public"."Subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subcategory" ADD CONSTRAINT "Subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductSubcategory" ADD CONSTRAINT "ProductSubcategory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductSubcategory" ADD CONSTRAINT "ProductSubcategory_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "public"."Subcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

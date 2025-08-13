/*
  Warnings:

  - You are about to drop the `ProductSubcategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ProductSubcategory" DROP CONSTRAINT "ProductSubcategory_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductSubcategory" DROP CONSTRAINT "ProductSubcategory_subcategoryId_fkey";

-- DropTable
DROP TABLE "public"."ProductSubcategory";

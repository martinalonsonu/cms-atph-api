/*
  Warnings:

  - You are about to drop the column `featuredImageId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `Media` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_uploadedBy_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_featuredImageId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "featuredImageId",
ADD COLUMN     "featuredImage" TEXT;

-- DropTable
DROP TABLE "Media";

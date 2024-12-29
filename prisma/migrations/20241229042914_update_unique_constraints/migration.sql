/*
  Warnings:

  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,url]` on the table `Stream` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Stream_url_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "provider";

-- DropEnum
DROP TYPE "Provider";

-- CreateIndex
CREATE UNIQUE INDEX "Stream_userId_url_key" ON "Stream"("userId", "url");

/*
  Warnings:

  - The primary key for the `ShortUrl` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ShortUrl` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ShortUrl" DROP CONSTRAINT "ShortUrl_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ShortUrl_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Click" (
    "id" SERIAL NOT NULL,
    "shortUrlId" INTEGER NOT NULL,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,

    CONSTRAINT "Click_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Click_shortUrlId_idx" ON "Click"("shortUrlId");

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_shortUrlId_fkey" FOREIGN KEY ("shortUrlId") REFERENCES "ShortUrl"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

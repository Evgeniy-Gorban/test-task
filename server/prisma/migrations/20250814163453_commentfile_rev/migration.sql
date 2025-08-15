/*
  Warnings:

  - You are about to drop the column `size` on the `comment_file` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[comment_id]` on the table `comment_file` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."comment_file" DROP COLUMN "size";

-- CreateIndex
CREATE UNIQUE INDEX "comment_file_comment_id_key" ON "public"."comment_file"("comment_id");

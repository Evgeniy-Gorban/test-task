-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_parentId_fkey";

-- AlterTable
ALTER TABLE "public"."Comment" ADD COLUMN     "filePath" TEXT;

-- CreateIndex
CREATE INDEX "Comment_created_at_idx" ON "public"."Comment"("created_at");

-- CreateIndex
CREATE INDEX "Comment_email_idx" ON "public"."Comment"("email");

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

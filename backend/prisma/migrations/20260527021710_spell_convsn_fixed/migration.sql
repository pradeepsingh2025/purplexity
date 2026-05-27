/*
  Warnings:

  - You are about to drop the column `converstaionId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Converstaion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Converstaion" DROP CONSTRAINT "Converstaion_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_converstaionId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "converstaionId",
ALTER COLUMN "conversationId" DROP NOT NULL;

-- DropTable
DROP TABLE "Converstaion";

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "slug" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_slug_key" ON "Conversation"("slug");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

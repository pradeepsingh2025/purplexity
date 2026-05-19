-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('User', 'Assistant');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('Github', 'Google');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "provider" "AuthProvider" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Converstaion" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "slug" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Converstaion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "conversationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "converstaionId" TEXT,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Converstaion" ADD CONSTRAINT "Converstaion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_converstaionId_fkey" FOREIGN KEY ("converstaionId") REFERENCES "Converstaion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `etaMinutes` on the `Sprint` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Module` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[moduleId,name]` on the table `Sprint` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Sprint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Sprint" DROP COLUMN "etaMinutes",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Module_name_key" ON "Module"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Sprint_moduleId_name_key" ON "Sprint"("moduleId", "name");

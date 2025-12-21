-- DropIndex
DROP INDEX "Account_id_key";

-- DropIndex
DROP INDEX "Opinion_id_key";

-- DropIndex
DROP INDEX "Session_id_key";

-- DropIndex
DROP INDEX "User_id_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;

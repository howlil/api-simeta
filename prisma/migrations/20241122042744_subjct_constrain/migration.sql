-- DropForeignKey
ALTER TABLE "Subject_Study" DROP CONSTRAINT "Subject_Study_ta_id_fkey";

-- AlterTable
ALTER TABLE "Subject_Study" ALTER COLUMN "ta_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Subject_Study" ADD CONSTRAINT "Subject_Study_ta_id_fkey" FOREIGN KEY ("ta_id") REFERENCES "TA"("id") ON DELETE SET NULL ON UPDATE CASCADE;

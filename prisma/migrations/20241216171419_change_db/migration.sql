/*
  Warnings:

  - You are about to drop the column `milestone_id` on the `Progress_TA` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Mahasiswa` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Progress_TA" DROP CONSTRAINT "Progress_TA_milestone_id_fkey";

-- AlterTable
ALTER TABLE "Progress_TA" DROP COLUMN "milestone_id";

-- AlterTable
ALTER TABLE "TA" ADD COLUMN     "max_logbook" INTEGER NOT NULL DEFAULT 20;

-- CreateTable
CREATE TABLE "Progress_Milestone_TA" (
    "milestone_id" TEXT NOT NULL,
    "progress_ta_id" TEXT NOT NULL,
    "max_point" INTEGER NOT NULL,
    "point" INTEGER NOT NULL,

    CONSTRAINT "Progress_Milestone_TA_pkey" PRIMARY KEY ("milestone_id","progress_ta_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mahasiswa_email_key" ON "Mahasiswa"("email");

-- AddForeignKey
ALTER TABLE "Progress_Milestone_TA" ADD CONSTRAINT "Progress_Milestone_TA_milestone_id_fkey" FOREIGN KEY ("milestone_id") REFERENCES "Milestone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress_Milestone_TA" ADD CONSTRAINT "Progress_Milestone_TA_progress_ta_id_fkey" FOREIGN KEY ("progress_ta_id") REFERENCES "Progress_TA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

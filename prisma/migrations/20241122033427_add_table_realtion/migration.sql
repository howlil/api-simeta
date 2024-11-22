/*
  Warnings:

  - You are about to drop the column `NIM` on the `Mahasiswa` table. All the data in the column will be lost.
  - Added the required column `nim` to the `Mahasiswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mahasiswa" DROP COLUMN "NIM",
ADD COLUMN     "nim" TEXT NOT NULL,
ADD COLUMN     "photoUrl" TEXT;

-- CreateTable
CREATE TABLE "TA" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,

    CONSTRAINT "TA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "ta_id" TEXT NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progress_TA" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "milestone_id" TEXT NOT NULL,

    CONSTRAINT "Progress_TA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject_Study" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "ta_id" TEXT NOT NULL,

    CONSTRAINT "Subject_Study_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dospem" (
    "dosen_id" TEXT NOT NULL,
    "ta_id" TEXT NOT NULL,

    CONSTRAINT "Dospem_pkey" PRIMARY KEY ("dosen_id","ta_id")
);

-- CreateTable
CREATE TABLE "Dosen" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "postion" TEXT NOT NULL,

    CONSTRAINT "Dosen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bidang_Dosen" (
    "dosen_id" TEXT NOT NULL,
    "subject_study_id" TEXT NOT NULL,

    CONSTRAINT "Bidang_Dosen_pkey" PRIMARY KEY ("dosen_id","subject_study_id")
);

-- CreateTable
CREATE TABLE "Logbook" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "attachment_url" TEXT NOT NULL,
    "ta_id" TEXT NOT NULL,

    CONSTRAINT "Logbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "due_date" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TA_mahasiswa_id_key" ON "TA"("mahasiswa_id");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_Study_ta_id_key" ON "Subject_Study"("ta_id");

-- AddForeignKey
ALTER TABLE "TA" ADD CONSTRAINT "TA_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "Mahasiswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_ta_id_fkey" FOREIGN KEY ("ta_id") REFERENCES "TA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress_TA" ADD CONSTRAINT "Progress_TA_milestone_id_fkey" FOREIGN KEY ("milestone_id") REFERENCES "Milestone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject_Study" ADD CONSTRAINT "Subject_Study_ta_id_fkey" FOREIGN KEY ("ta_id") REFERENCES "TA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dospem" ADD CONSTRAINT "Dospem_dosen_id_fkey" FOREIGN KEY ("dosen_id") REFERENCES "Dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dospem" ADD CONSTRAINT "Dospem_ta_id_fkey" FOREIGN KEY ("ta_id") REFERENCES "TA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bidang_Dosen" ADD CONSTRAINT "Bidang_Dosen_dosen_id_fkey" FOREIGN KEY ("dosen_id") REFERENCES "Dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bidang_Dosen" ADD CONSTRAINT "Bidang_Dosen_subject_study_id_fkey" FOREIGN KEY ("subject_study_id") REFERENCES "Subject_Study"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logbook" ADD CONSTRAINT "Logbook_ta_id_fkey" FOREIGN KEY ("ta_id") REFERENCES "TA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "Mahasiswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

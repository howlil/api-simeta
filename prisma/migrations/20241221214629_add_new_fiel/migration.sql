/*
  Warnings:

  - You are about to drop the column `postion` on the `Dosen` table. All the data in the column will be lost.
  - You are about to drop the column `max_point` on the `Progress_Milestone_TA` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `Bidang_Dosen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `Dosen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Dosen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Dospem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Logbook` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `date` on the `Logbook` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `max_point` to the `Milestone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Milestone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Progress_TA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Reminder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Subject_Study` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `TA` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bidang_Dosen" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Dosen" DROP COLUMN "postion",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "position" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Dospem" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Logbook" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Milestone" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "max_point" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Progress_Milestone_TA" DROP COLUMN "max_point";

-- AlterTable
ALTER TABLE "Progress_TA" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Subject_Study" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TA" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Bimbingan_TA" (
    "id" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "aktifitas" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "ta_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bimbingan_TA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengajuan_TA" (
    "id" TEXT NOT NULL,
    "bukti1" TEXT NOT NULL,
    "bukti2" TEXT NOT NULL,
    "bukti3" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "ta_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pengajuan_TA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Semhas" (
    "id" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "jam" TEXT NOT NULL,
    "dokumen" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "ta_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Semhas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sidang" (
    "id" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "jam" TEXT NOT NULL,
    "dokumen" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "ta_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sidang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "draft" TEXT NOT NULL,
    "ta_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bimbingan_TA" ADD CONSTRAINT "Bimbingan_TA_ta_id_fkey" FOREIGN KEY ("ta_id") REFERENCES "TA"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengajuan_TA" ADD CONSTRAINT "Pengajuan_TA_ta_id_fkey" FOREIGN KEY ("ta_id") REFERENCES "TA"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Semhas" ADD CONSTRAINT "Semhas_ta_id_fkey" FOREIGN KEY ("ta_id") REFERENCES "TA"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sidang" ADD CONSTRAINT "Sidang_ta_id_fkey" FOREIGN KEY ("ta_id") REFERENCES "TA"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_ta_id_fkey" FOREIGN KEY ("ta_id") REFERENCES "TA"("id") ON DELETE SET NULL ON UPDATE CASCADE;

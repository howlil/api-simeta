const { TA_STATUS, MILESTONE_STATUS } = require('../../src/constants/status.js'); // Import status constants
const prisma = require('../../src/configs/db.js');

const taData = {
  title: 'Implementasi Artificial Intelligence untuk Prediksi Cuaca',
  description: 'Penelitian ini bertujuan untuk mengimplementasikan model Artificial Intelligence dalam memprediksi cuaca menggunakan data historis.',
  subjectStudy: 'Artificial Intelligence', // Bidang studi yang dipilih
  milestones: [
    {
      name: 'Pengajuan Judul TA',
      description: 'Anda telah menyelesaikan Pengajuan Judul TA, lanjutkan tahap selanjutnya',
      status: MILESTONE_STATUS.IN_PROGRESS,
      max_point: 100,
    },
    {
      name: 'Pengajuan Proposal TA',
      description: 'Waduh anda belum sampai tahap ini',
      status: MILESTONE_STATUS.NOT_STARTED,
      max_point: 200,
    },
    {
      name: 'Seminar Hasil TA',
      description: 'Waduh anda belum sampai tahap ini',
      status: MILESTONE_STATUS.NOT_STARTED,
      max_point: 300,
    },
    {
      name: 'Sidang TA',
      description: 'Waduh anda belum sampai tahap ini',
      status: MILESTONE_STATUS.NOT_STARTED,
      max_point: 400,
    },
    {
      name: 'Kelulusan',
      description: 'Waduh anda belum sampai tahap ini',
      status: MILESTONE_STATUS.NOT_STARTED,
      max_point: 500,
    },
  ],
};

async function seedTA() {
  try {
    console.log('Mulai seeding TA...');

    // 1. Cari mahasiswa berdasarkan email
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { email: 'ulil@unand.id' },
    });

    if (!mahasiswa) {
      console.error('Mahasiswa Ahmad Farhan tidak ditemukan');
      return;
    }
    console.log(`Mahasiswa ditemukan: ${mahasiswa.full_name} (${mahasiswa.id})`);

    // 2. Cari subject study berdasarkan bidang yang dipilih
    const subjectStudy = await prisma.subject_Study.findFirst({
      where: { subject: taData.subjectStudy },
    });

    if (!subjectStudy) {
      console.error(`Subject Study "${taData.subjectStudy}" tidak ditemukan`);
      return;
    }
    console.log(`Subject Study ditemukan: ${subjectStudy.subject} (${subjectStudy.id})`);

    // 3. Cari dosen yang memiliki bidang studi sesuai dengan subject study
    const dosen = await prisma.dosen.findFirst({
      where: {
        bidang_dosen: {
          some: { subject_study_id: subjectStudy.id },
        },
      },
    });

    if (!dosen) {
      console.error(`Dosen dengan bidang "${taData.subjectStudy}" tidak ditemukan`);
      return;
    }
    console.log(`Dosen ditemukan: ${dosen.full_name} (${dosen.id})`);

    // 4. Hapus TA lama jika ada
    await prisma.tA.deleteMany({
      where: { mahasiswa_id: mahasiswa.id },
    });

    // 5. Buat TA beserta milestone, subject_study, dan dospem
    const createdTA = await prisma.tA.create({
      data: {
        title: taData.title,
        description: taData.description,
        mahasiswa: { connect: { id: mahasiswa.id } },
        subject_study: { connect: { id: subjectStudy.id } },
        dospem: {
          create: {
            dosen: { connect: { id: dosen.id } },
          },
        },
        milestone: {
          create: taData.milestones.map((milestone) => ({
            name: milestone.name,
            description: milestone.description,
            status: milestone.status,
            max_point: milestone.max_point,
          })),
        },
      },
      include: {
        milestone: true,
        dospem: { include: { dosen: true } },
        subject_study: true,
      },
    });

    console.log('TA berhasil dibuat dengan detail berikut:');
    console.log(JSON.stringify(createdTA, null, 2));
  } catch (error) {
    console.error('Error saat seeding TA:', error);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = seedTA;

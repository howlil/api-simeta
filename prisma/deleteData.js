const prisma = require('../src/configs/db.js')

const deleteAllData = async () => {
  try {
    // Hapus data pada setiap tabel
    await prisma.token.deleteMany();
    await prisma.reminder.deleteMany();
    await prisma.logbook.deleteMany();
    await prisma.bidang_Dosen.deleteMany();
    await prisma.dospem.deleteMany();
    await prisma.progress_TA.deleteMany();
    await prisma.milestone.deleteMany();
    await prisma.subject_Study.deleteMany();
    await prisma.dosen.deleteMany();
    await prisma.mahasiswa.deleteMany();

    console.log('Semua data berhasil dihapus.');
  } catch (error) {
    console.error('Terjadi kesalahan saat menghapus data:', error);
  } finally {
    await prisma.$disconnect();
  }
};

deleteAllData();

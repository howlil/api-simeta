const prisma = require('../../src/configs/db.js');

const taData = {
  title: 'Implementasi Artificial Intelligence untuk Prediksi Cuaca',
  description: 'Penelitian ini bertujuan untuk mengimplementasikan model Artificial Intelligence dalam memprediksi cuaca menggunakan data historis.',
  milestones: [
    { name: 'Proposal TA', description: 'Penyusunan proposal Tugas Akhir', status: 'completed' },
  ]
};

async function seedTA() {
  try {
    console.log('Mulai seeding TA...');

    // Cari mahasiswa Ahmad Farhan berdasarkan email
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { email: 'ahmadfarhan@unand.id' }
    });

    if (!mahasiswa) {
      console.error('Mahasiswa Ahmad Farhan tidak ditemukan');
      return;
    }

    console.log(`Mahasiswa ditemukan: ${mahasiswa.full_name} (${mahasiswa.id})`);

    // Hapus TA lama jika ada
    await prisma.tA.deleteMany({
      where: { mahasiswa_id: mahasiswa.id }
    });

    // Buat TA baru dan milestone-nya
    const createdTA = await prisma.tA.create({
      data: {
        title: taData.title,
        description: taData.description,
        mahasiswa: { connect: { id: mahasiswa.id } },
        milestone: {
          create: taData.milestones.map((milestone) => ({
            name: milestone.name,
            description: milestone.description,
            status: milestone.status
          }))
        }
      },
      include: { milestone: true } // Sertakan milestone yang dibuat
    });

    console.log('TA berhasil ditambahkan:', createdTA);
    console.log('Milestone TA:', createdTA.milestone);

    console.log('Seeding TA selesai!');
  } catch (error) {
    console.error('Error saat seeding TA:', error);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = seedTA;

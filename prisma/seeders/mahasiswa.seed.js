const { encryptPassword } = require('../../src/utils/bcrypt');
const prisma = require('../../src/configs/db.js');

const mahasiswaData = [
  {
    full_name: 'Mhd Ulil Abshae',
    email: 'ulil@unand.id',
    nim: '2011521001',
    password: '@Test123'
  },
  {
    full_name: 'Siti Rahma',
    email: 'sitirahma@unand.id',
    nim: '2011521002',
    password: '@Test123'
  },
  {
    full_name: 'Muhammad Rizki',
    email: 'muhammadrizki@unand.id',
    nim: '2011521003',
    password: '@Test123'
  },
  {
    full_name: 'Anisa Putri',
    email: 'anisaputri@unand.id',
    nim: '2011521004',
    password: '@Test123'
  },
  {
    full_name: 'Dimas Pratama',
    email: 'dimaspratama@unand.id',
    nim: '2011521005',
    password: '@Test123'
  }
];

async function seedMahasiswa() {
  try {
    console.log('Mulai seeding mahasiswa...');

    await prisma.mahasiswa.deleteMany();
    console.log('Data mahasiswa lama dihapus');

    for (const data of mahasiswaData) {
      const hashedPassword = await encryptPassword(data.password);
      
      await prisma.mahasiswa.create({
        data: {
          full_name: data.full_name,
          email: data.email,
          nim: data.nim,
          password: hashedPassword
        }
      });
      
      console.log(`Mahasiswa ${data.full_name} berhasil ditambahkan`);
    }

    console.log('Seeding mahasiswa selesai!');
  } catch (error) {
    console.error('Error saat seeding mahasiswa:', error);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = seedMahasiswa;
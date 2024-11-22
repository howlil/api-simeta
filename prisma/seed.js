const seedMahasiswa = require('./seeders/mahasiswa.seed.js')
const seedDosen = require('./seeders/dosen.seed.js')
const seedBidang = require('./seeders/bidang.seed.js')

async function main() {
  try {
    await seedMahasiswa();
    await seedBidang()
    await seedDosen()

  } catch (error) {
    console.error('Error saat menjalankan seeder:', error);
    process.exit(1);
  }
}

main();
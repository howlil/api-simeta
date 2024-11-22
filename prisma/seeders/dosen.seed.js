const prisma = require('../../src/configs/db.js');


const dosenData = [
  {
    full_name: 'Dr. Surya Afnarius, M.Sc',
    nip: '196404091995121001',
    postion: 'Professor',
    bidang: ['Artificial Intelligence', 'Data Mining']
  },
  {
    full_name: 'Dr. Eng. Lusi Susanti, M.Eng',
    nip: '197608122006042001',
    postion: 'Associate Professor',
    bidang: ['Software Engineering', 'Information Security']
  },
  {
    full_name: 'Prof. Dr. Eng. Heru Dibyo Laksono, MT',
    nip: '197701072005011002',
    postion: 'Professor',
    bidang: ['Computer Network', 'Information Security']
  },
  {
    full_name: 'Dr. Ahmad Syafruddin Indrapriyatna, MT',
    nip: '196307071991031003',
    postion: 'Associate Professor',
    bidang: ['Database Management', 'Web Development']
  },
  {
    full_name: 'Rahmi Eka Putri, MT',
    nip: '198407232008012002',
    postion: 'Assistant Professor',
    bidang: ['Mobile Development', 'Cloud Computing']
  },
  {
    full_name: 'Dr. Rika Ampuh Hadiguna, MT, IPM',
    nip: '197307271998021001',
    postion: 'Professor',
    bidang: ['Machine Learning', 'Data Mining']
  }
];

async function seedDosen() {
  try {
    console.log('Mulai seeding dosen...');

    await prisma.bidang_Dosen.deleteMany();
    await prisma.dosen.deleteMany();
    console.log('Data dosen lama dihapus');

    const existingSubjects = await prisma.subject_Study.findMany();

    for (const dosen of dosenData) {
      const createdDosen = await prisma.dosen.create({
        data: {
          full_name: dosen.full_name,
          nip: dosen.nip,
          postion: dosen.postion
        }
      });
      
      for (const bidangName of dosen.bidang) {
        const subject = existingSubjects.find(s => s.subject === bidangName);
        if (subject) {
          await prisma.bidang_Dosen.create({
            data: {
              dosen_id: createdDosen.id,
              subject_study_id: subject.id
            }
          });
        }
      }
      
      console.log(`Dosen ${dosen.full_name} dan bidangnya berhasil ditambahkan`);
    }

    console.log('Seeding dosen selesai!');
  } catch (error) {
    console.error('Error saat seeding dosen:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = seedDosen;
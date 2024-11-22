const prisma = require('../../src/configs/db.js');


const subjectData = [
    {
      subject: 'Artificial Intelligence'
    },
    {
      subject: 'Data Mining'
    },
    {
      subject: 'Computer Network'
    },
    {
      subject: 'Web Development'
    },
    {
      subject: 'Mobile Development'
    },
    {
      subject: 'Information Security'
    },
    {
      subject: 'Database Management'
    },
    {
      subject: 'Software Engineering'
    }
  ];


  async function seedSubject() {
    try {
  
      await prisma.subject_Study.deleteMany();
  
      const subjects = await Promise.all(
        subjectData.map(async (subject) => {
          const createdSubject = await prisma.subject_Study.create({
            data: {
              subject: subject.subject
            }
          });
          return createdSubject;
        })
      );
  
      console.log('Seeding subject selesai!');
      return subjects; 
    } catch (error) {
      console.error('Error saat seeding subject:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }
  
  module.exports = seedSubject;
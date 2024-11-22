const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  errorFormat: "pretty",
  log: ["query", "info", "warn", "error"],
});

async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("Koneksi database berhasil.");
  } catch (error) {
    console.error("Koneksi database tidak berhasil: ", error);
  } finally {
    await prisma.$disconnect();
  }
}

if (process.env.NODE_ENV !== "production") {
  checkDatabaseConnection();
}

async function gracefulShutdown() {
  try {
    await prisma.$disconnect();
    console.log("Koneksi database ditutup dengan aman.");
    process.exit(0);
  } catch (error) {
    console.error("Error saat menutup koneksi database:", error);
    process.exit(1);
  }
}


module.exports = prisma;
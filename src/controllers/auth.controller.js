// src/controllers/auth.controller.js
const prisma = require('../configs/db.js');
const { checkPassword } = require('../utils/bcrypt.js');
const { generateToken } = require('../utils/jwt.js');
const { logger } = require('../utils/logging.js');
const { loginSchema } = require('../validations/auth.validation.js');
const validate = require('../middlewares/validate.middleware.js');
const { error } = require('winston');

const login = async (req, res) => {
  try {
    logger.info('Login process started');

    // Validasi input
    logger.info('Validating request body');
    const validation = await validate(loginSchema, req.body);
    if (validation.error) {
      logger.warn('Validation failed', { errors: validation.messages });
      return res.status(400).json({
        error: true,
        message: validation.messages,
      });
    }

    const { email, password, fcmToken } = validation.data;
    logger.info(`Validation successful, attempting to find user with email: ${email}`);

    // Cari user dengan email yang sudah divalidasi
    const user = await prisma.mahasiswa.findUnique({
      where: { email },
    });

    if (!user) {
      logger.warn(`User not found with email: ${email}`);
      return res.status(404).json({
        error: true,
        message: 'User tidak ditemukan',
        data: null,
      });
    }

    logger.info(`User found: ${user.full_name} (${user.email})`);

    // Verifikasi password
    try {
      logger.info('Checking password');
      const isPasswordValid = await checkPassword(password, user.password);
      if (!isPasswordValid) {
        logger.warn(`Password incorrect for user: ${email}`);
        return res.status(401).json({
          error: true,
          message: 'Password salah',
        });
      }
      logger.info('Password verification successful');
    } catch (error) {
      logger.error('Password check error', { error });
      return res.status(500).json({
        error: true,
        message: 'Error saat verifikasi password',
      });
    }

    if (fcmToken) {
      logger.info(`Updating FCM token for user: ${user.email}`);
      await prisma.mahasiswa.update({
        where: { id: user.id },
        data: { fcmToken },
      });
      logger.info(`FCM token updated for user: ${user.email}`);
    } else {
      logger.warn('No FCM token provided in request');
    }
    // Generate token
    logger.info('Generating JWT token');
    const token = generateToken(user.id);

    // Simpan token ke database
    logger.info(`Storing token in database for user: ${user.email}`);
    await prisma.token.create({
      data: {
        token,
        mahasiswa_id: user.id,
      },
    });

    logger.info(`Token stored successfully for user: ${user.email}`);

    // Response berhasil
    logger.info(`Login successful for user: ${user.email}`);
    return res.status(200).json({
      error: false,
      message: 'Login berhasil',
      data: {
        token,
      },
    });
  } catch (error) {
    logger.error('Login error', { error });
    return res.status(500).json({
      error: true,
      message: 'Terjadi kesalahan saat login',
    });
  }
};

const me = async (req, res) => {
  try {
    // Ambil ID user dari req.user
    const id = req.user.id;

    // Cari user berdasarkan ID
    const user = await prisma.mahasiswa.findUnique({
      where: { id },
    });

    // Periksa apakah user ditemukan
    if (!user) {
      logger.warn(`User with ID ${id} not found`);
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    // Kirim respon jika user ditemukan
    res.status(200).json({
      error: false,
      message: "User data fetched successfully",
      data: user,
    });
  } catch (error) {
    logger.error(`Error fetching user data: ${error.message}`, { error });
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};
const dashboard = async (req, res) => {
  try {
    logger.info("Fetching dashboard data");

    const userId = req.user?.id; // ID user dari token
    if (!userId) {
      logger.warn("User ID not found in request");
      return res.status(400).json({
        error: true,
        message: "User ID is required",
      });
    }

    // 1. Fetch TA ID terkait user
    const ta = await prisma.tA.findUnique({
      where: { mahasiswa_id: userId },
    });

    if (!ta) {
      logger.warn(`TA not found for user ID: ${userId}`);
      return res.status(404).json({
        error: true,
        message: "TA not found. Please register your TA first.",
      });
    }

    // 2. Fetch reminders (hanya 1 data dengan tanggal terdekat dari hari ini)
    const reminder = await prisma.reminder.findFirst({
      where: { mahasiswa_id: userId },
      orderBy: { due_date: "asc" },
    });

    // 3. Count logbooks
    const logbookCount = await prisma.logbook.count({
      where: { ta_id: ta.id },
    });

    // 4. Fetch max_logbook dari TA
    const maxLogbook = ta.max_logbook;

    // 5. Fetch current milestone (status: IN_PROGRESS)
    const currentMilestone = await prisma.milestone.findFirst({
      where: {
        ta_id: ta.id,
        status: {
          in: ["IN_PROGRESS", "COMPLETED"]
        }
      }
    });

    // 6. Fetch all milestones with their status
    const milestones = await prisma.milestone.findMany({
      where: { ta_id: ta.id },
      orderBy: { created_at: "asc" },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    res.status(200).json({
      error: false,
      messages: "Dashboard data fetched successfully",
      data: {
        reminder,
        logbook: {
          count: logbookCount,
          max: maxLogbook,
        },
        current_milestone: currentMilestone
          ? {
              id: currentMilestone.id,
              name: currentMilestone.name,
              description: currentMilestone.description,
              status: currentMilestone.status,
            }
          : null,
        milestones,
      },
    });
  } catch (error) {
    logger.error(`Error fetching dashboard data: ${error.message}`);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

const logout = async (req, res) => {
  const { userId } = req.user.id;

  try {
    await prisma.mahasiswa.update({
      where: { id: userId },
      data: { fcmToken: null },
    });

    res.status(200).json({ error: false, message: 'Logout berhasil' });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Terjadi kesalahan saat logout' });
  }
};

module.exports = { login, me,dashboard ,logout};

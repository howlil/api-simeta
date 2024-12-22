// src/controllers/auth.controller.js
const prisma = require('../configs/db.js');
const { checkPassword } = require('../utils/bcrypt.js');
const { generateToken } = require('../utils/jwt.js');
const { logger } = require('../utils/logging.js');
const { loginSchema } = require('../validations/auth.validation.js');
const validate = require('../middlewares/validate.middleware.js');

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

    const { email, password } = validation.data;
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

module.exports = { login };

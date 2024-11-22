// src/controllers/auth.controller.js
const prisma = require('../configs/db.js');
const { checkPassword } = require('../utils/bcrypt.js');
const { generateToken } = require('../utils/jwt.js');
const {logger} = require('../utils/logging.js');
const {loginSchema} = require('../validations/auth.validation.js')
const validate = require('../middlewares/validate.midlleware.js')


const login = async (req, res) => {
  try {
    const validation = await validate(loginSchema, req.body);
    if (validation.error) {
      return res.status(400).json({
        error: true,
        message: validation.messages,
      });
    }

    const { email, password } = validation.data;

    // Cari user dengan email yang sudah divalidasi
    const user = await prisma.mahasiswa.findFirst({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User tidak ditemukan',
        data: null
      });
    }

    try {
      const isPasswordValid = await checkPassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          error: true,
          message: 'Password salah',
        });
      }
    } catch (error) {
      logger.error('Password check error:', error);
      return res.status(500).json({
        error: true,
        message: 'Error saat verifikasi password',
      });
    }

    const token = generateToken(user.id);

    await prisma.token.create({
      data: {
        token,
        mahasiswa_id: user.id
      }
    });

    return res.status(200).json({
      error: false,
      message: 'Login berhasil',
      data: {
        token,
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = {login} ;
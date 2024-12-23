// src/validations/auth.validation.js
const yup = require('yup');

const loginSchema = yup.object({
  email: yup
    .string()
    .email('Format email tidak valid')
    .required('Email wajib diisi'),
  password: yup
    .string()
    .min(6, 'Password minimal 6 karakter')
    .required('Password wajib diisi'),
    fcmToken: yup.string().optional(),

});

module.exports = {
  loginSchema
};

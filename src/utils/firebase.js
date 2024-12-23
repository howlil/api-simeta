const admin = require('firebase-admin');
require('dotenv').config();

// Path ke file service account Firebase Anda
const serviceAccount = require('../../service-accounts.json');
const serviceAccount2 = JSON.parse(process.env.FIREBASE_KEY);

const credentials = process.env.NODE_ENV === 'production' ? serviceAccount2 : serviceAccount;

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

module.exports = admin;
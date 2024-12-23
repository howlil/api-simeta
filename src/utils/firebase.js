const admin = require('firebase-admin');

const serviceAccount = require('../../service-accounts.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;

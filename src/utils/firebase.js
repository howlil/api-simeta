const admin = require('firebase-admin');
const fs = require('fs');
require('dotenv').config(); // Load .env file

let serviceAccount = null;

try {
  const serviceAccountPath = '../../service-accounts.json'; // Adjust the path as needed
  if (fs.existsSync(serviceAccountPath)) {
    serviceAccount = require(serviceAccountPath);
    console.log("Using service account from JSON file.");
  }
} catch (error) {
  console.warn("Failed to load service account JSON:", error.message);
}

if (!serviceAccount) {
  if (process.env.FIREBASE_KEY) {
    console.log("Using service account from FIREBASE_KEY environment variable.");
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_KEY); // Parse JSON string from FIREBASE_KEY
    } catch (error) {
      throw new Error("Failed to parse FIREBASE_KEY. Ensure it contains valid JSON.");
    }
  } else {
    throw new Error(
      "Firebase Admin SDK configuration missing. Provide a service account JSON file or set the FIREBASE_KEY environment variable."
    );
  }
}

// Inisialisasi Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("Firebase Admin SDK initialized successfully.");

module.exports = admin;

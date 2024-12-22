const prisma = require("../configs/db.js");
const { logger } = require("../utils/logging.js");
const { decodeToken } = require("../utils/jwt.js");

const authenticate = async (req, res, next) => {
  try {
    logger.info("Starting authentication middleware");

    // 1. Ambil token dari header Authorization
    const token = req.get("Authorization");
    logger.info(`Authorization header: ${token}`);

    if (!token || !token.startsWith("Bearer")) {
      logger.warn("Authorization header missing or invalid format");
      return res.status(401).json({
        message: "You are unauthorized, please login first",
      });
    }

    const extractedToken = token.substr(7);
    logger.info(`Extracted token: ${extractedToken}`);

    if (!extractedToken || extractedToken === "null") {
      logger.warn("No valid token provided");
      return res.status(401).json({
        message: "You are unauthorized, please login first",
      });
    }

    // 2. Decode token
    let claims;
    try {
      claims = decodeToken(extractedToken);
      logger.info(`Decoded token claims: ${JSON.stringify(claims)}`);
    } catch (error) {
      logger.warn("Invalid or expired token", { error: error.message });
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    if (!claims || !claims.uuid) {
      logger.warn("Invalid token claims");
      return res.status(401).json({
        message: "You are unauthorized, please login first",
      });
    }

    // 3. Cari user berdasarkan claims.uuid
    logger.info(`Searching for user with ID: ${claims.uuid}`);
    let user;
    try {
      user = await prisma.mahasiswa.findUnique({
        where: { id: claims.uuid },
        include: {
          token: true,
          ta: true,
        },
      });
    } catch (error) {
      logger.error("Error querying user", { error: error.message });
      throw error;
    }

    if (!user) {
      logger.warn(`User with ID ${claims.uuid} not found`);
      return res.status(401).json({
        message: "You are unauthorized, please login first",
      });
    }

    // 4. Cari session token
    logger.info(`Searching for session token: ${extractedToken}`);
    let sessionToken;
    try {
      sessionToken = await prisma.token.findFirst({
        where: {
          token: extractedToken,
          mahasiswa_id: claims.uuid,
        },
      });
    } catch (error) {
      logger.error("Error querying session token", { error: error.message });
      throw error;
    }

    if (!sessionToken) {
      logger.warn("Session token not found or invalid");
      return res.status(401).json({
        message: "Session expired or invalid, please login again",
      });
    }

    // 5. Set user data dan session token ke req
    req.user = user;
    req.sessionToken = sessionToken;
    logger.info(`User ${user.id} authenticated successfully`);

    next();
  } catch (error) {
    logger.error("Authentication error", { error: error.message });
    res.status(500).json({
      message: "An error occurred during authentication",
    });
  }
};

module.exports = { authenticate };

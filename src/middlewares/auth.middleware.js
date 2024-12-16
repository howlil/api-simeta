const prisma = require("../configs/db.js");
const { logger } = require("../utils/logging.js");
const { decodeToken } = require("../utils/jwt.js");

const authenticate = async (req, res, next) => {
  try {
    const token = req.get("Authorization");

    if (!token || !token.startsWith("Bearer")) {
      logger.info("Authorization header missing or invalid format");
      return res.status(401).json({
        message: "You are unauthorized, please login first",
      });
    }

    const extractedToken = token.substr(7);
    if (!extractedToken || extractedToken === "null") {
      logger.info("No valid token provided");
      return res.status(401).json({
        message: "You are unauthorized, please login first",
      });
    }

    // 3. Decode token
    let claims;
    try {
      claims = decodeToken(extractedToken);
    } catch (error) {
      logger.info("Invalid or expired token");
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    logger.info(claims)

    if (!claims || !claims.uuid ) {
      logger.info("Invalid token claims");
      return res.status(401).json({
        message: "You are unauthorized, please login first",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: claims.uuid },
      include: {
         token: true, 
         ta : true
       }, 
    });

    if (!user) {
      logger.info(`User with ID ${claims.uuid} not found`);
      return res.status(401).json({
        message: "You are unauthorized, please login first",
      });
    }

    const sessionToken = await prisma.token.findFirst({
      where: {
        token: extractedToken,
        user_id: claims.uuid,
      },
    });

    if (!sessionToken) {
      logger.info("Session token not found or invalid");
      return res.status(401).json({
        message: "Session expired or invalid, please login again",
      });
    }

    req.user = user;
    req.sessionToken = sessionToken;
    

    logger.info(`User ${user.id} authenticated successfully`);
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    res.status(500).json({
      message: "An error occurred during authentication",
    });
  }
};

module.exports = { authenticate };
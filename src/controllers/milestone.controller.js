const prisma = require("../configs/db");
const { logger } = require("../utils/logging");

exports.getMilestonesByTA = async (req, res) => {
    try {
      const { ta_id } = req.params;
  
      const milestones = await prisma.milestone.findMany({
        where: { ta_id },
        include: {
          progress_TA: true, 
        },
      });
  
      res.status(200).json({
        error: false,
        messages: "Success",
        data: milestones,
      });
    } catch (err) {
      logger.error(`Error retrieving milestones: ${err.message}`);
      res.status(500).json({
        error: true,
        messages: "Internal server error",
      });
    }
  };
  

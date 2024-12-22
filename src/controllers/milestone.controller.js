const prisma = require("../configs/db");
const { logger } = require("../utils/logging");

exports.getMilestonesByTA = async (req, res) => {
  try {
    const { ta_id } = req.params;

    const milestones = await prisma.milestone.findMany({
      where: { ta_id },
      include: {
        progress_Milestone: {
          include: {
            progress_ta: true,
          },
        },
      },
    });

    if (!milestones.length) {
      return res.status(404).json({
        error: true,
        messages: "No milestones found for this TA",
      });
    }

    const formattedMilestones = milestones.map((milestone) => ({
      id: milestone.id,
      name: milestone.name,
      description: milestone.description,
      status: milestone.status,
      max_point: milestone.max_point,
      created_at: milestone.created_at,
      updated_at: milestone.updated_at,
      progress: milestone.progress_Milestone.map((progress) => ({
        progress_id: progress.progress_ta_id,
        title: progress.progress_ta?.title,
        details: progress.progress_ta?.details,
        point: progress.point,
      })),
    }));

    res.status(200).json({
      error: false,
      messages: "Success",
      data: formattedMilestones,
    });
  } catch (err) {
    logger.error(`Error retrieving milestones: ${err.message}`);
    res.status(500).json({
      error: true,
      messages: "Internal server error",
    });
  }
};

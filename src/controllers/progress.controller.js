const prisma = require("../configs/db");
const {
  createProgressSchema,
  updateProgressSchema,
} = require("../validations/progress.validation");
const { logger } = require("../utils/logging");
const { MILESTONE_STATUS, PROGRESS_STATUS } = require("../constants/status");

exports.createProgress = async (req, res) => {
  try {
    const { error, messages, data } = await createProgressSchema.validate(
      req.body,
      { abortEarly: false }
    );
    if (error) {
      return res.status(400).json({ error: true, messages });
    }

    const progress = await prisma.progress_TA.create({
      data: { ...data },
    });

    const milestone = await prisma.milestone.findUnique({
      where: { id: data.milestone_id },
    });

    if (!milestone) {
      return res.status(404).json({
        error: true,
        messages: "Milestone not found",
      });
    }

    let updatedStatus = milestone.status;
    if (
      milestone.name === "Pengajuan Judul TA" &&
      data.title === "Submit Judul TA"
    ) {
      updatedStatus = MILESTONE_STATUS.COMPLETED; // Milestone selesai
    } else if (
      milestone.name === "Pengajuan Proposal TA" &&
      data.title === "Submit Proposal TA"
    ) {
      updatedStatus = MILESTONE_STATUS.IN_PROGRESS; // Milestone dimulai
    }

    if (updatedStatus !== milestone.status) {
      await prisma.milestone.update({
        where: { id: milestone.id },
        data: { status: updatedStatus },
      });
    }

    logger.info("Progress TA created and milestone updated successfully");
    res.status(201).json({
      error: false,
      messages: "Progress TA created successfully",
      data: progress,
    });
  } catch (err) {
    logger.error(`Error creating progress: ${err.message}`);
    res.status(500).json({
      error: true,
      messages: "Internal server error",
    });
  }
};

exports.getProgressByMilestone = async (req, res) => {
  try {
    const { milestone_id } = req.params;

    const progressList = await prisma.progress_TA.findMany({
      where: { milestone_id },
    });

    res.status(200).json({
      error: false,
      messages: "Success",
      data: progressList,
    });
  } catch (err) {
    logger.error(`Error retrieving progress: ${err.message}`);
    res.status(500).json({
      error: true,
      messages: "Internal server error",
    });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { id } = req.params;

    const { error, messages, data } = await updateProgressSchema.validate(
      req.body,
      { abortEarly: false }
    );
    if (error) {
      return res.status(400).json({ error: true, messages });
    }

    const progress = await prisma.progress_TA.update({
      where: { id },
      data,
    });

    const milestone = await prisma.milestone.findUnique({
      where: { id: progress.milestone_id },
    });

    if (!milestone) {
      return res.status(404).json({
        error: true,
        messages: "Milestone not found",
      });
    }

    let updatedStatus = milestone.status;
    if (
      milestone.name === "Pengajuan Proposal TA" &&
      data.title === "Submit Proposal TA"
    ) {
      updatedStatus = MILESTONE_STATUS.IN_PROGRESS;
    }

    if (updatedStatus !== milestone.status) {
      await prisma.milestone.update({
        where: { id: milestone.id },
        data: { status: updatedStatus },
      });
    }

    logger.info("Progress TA updated successfully");
    res.status(200).json({
      error: false,
      messages: "Progress TA updated successfully",
      data: progress,
    });
  } catch (err) {
    logger.error(`Error updating progress: ${err.message}`);
    res.status(500).json({
      error: true,
      messages: "Internal server error",
    });
  }
};

exports.deleteProgress = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Hapus Progress TA
    const progress = await prisma.progress_TA.delete({
      where: { id },
    });

    const milestone = await prisma.milestone.findUnique({
      where: { id: progress.milestone_id },
    });

    if (!milestone) {
      return res.status(404).json({
        error: true,
        messages: "Milestone not found",
      });
    }

    let updatedStatus = milestone.status;
    const remainingProgress = await prisma.progress_TA.findMany({
      where: { milestone_id: milestone.id },
    });

    if (remainingProgress.length === 0) {
      updatedStatus = MILESTONE_STATUS.NOT_STARTED;
    }

    if (updatedStatus !== milestone.status) {
      await prisma.milestone.update({
        where: { id: milestone.id },
        data: { status: updatedStatus },
      });
    }

    logger.info("Progress TA deleted successfully");
    res.status(200).json({
      error: false,
      messages: "Progress TA deleted successfully",
    });
  } catch (err) {
    logger.error(`Error deleting progress: ${err.message}`);
    res.status(500).json({
      error: true,
      messages: "Internal server error",
    });
  }
};

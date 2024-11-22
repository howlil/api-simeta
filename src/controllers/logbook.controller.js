const prisma = require("../configs/db");
const { logger } = require("../utils/logging");
const { createLogbookSchema, updateLogbookSchema } = require("../validations/loogbook.validation.js");

exports.createLogbook = async (req, res) => {
  try {
    const { error, messages, data } = await createLogbookSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ error: true, messages });
    }

    const logbook = await prisma.logbook.create({
      data: {
        ...data,
      },
    });

    logger.info("Logbook created successfully");
    res.status(201).json({
      error: false,
      messages: "Logbook created successfully",
      data: logbook,
    });
  } catch (err) {
    logger.error(`Error creating logbook: ${err.message}`);
    res.status(500).json({
      error: true,
      messages: "Internal server error",
    });
  }
};

exports.getLogbooks = async (req, res) => {
  try {
    const logbooks = await prisma.logbook.findMany();
    res.status(200).json({
      error: false,
      messages: "Success",
      data: logbooks,
    });
  } catch (err) {
    logger.error(`Error retrieving logbooks: ${err.message}`);
    res.status(500).json({
      error: true,
      messages: "Internal server error",
    });
  }
};

exports.getLogbookById = async (req, res) => {
  try {
    const { id } = req.params;

    const logbook = await prisma.logbook.findUnique({
      where: { id },
    });

    if (!logbook) {
      return res.status(404).json({
        error: true,
        messages: "Logbook not found",
      });
    }

    res.status(200).json({
      error: false,
      messages: "Success",
      data: logbook,
    });
  } catch (err) {
    logger.error(`Error retrieving logbook: ${err.message}`);
    res.status(500).json({
      error: true,
      messages: "Internal server error",
    });
  }
};

exports.updateLogbook = async (req, res) => {
  try {
    const { id } = req.params;

    const { error, messages, data } = await updateLogbookSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ error: true, messages });
    }

    const updatedLogbook = await prisma.logbook.update({
      where: { id },
      data,
    });

    res.status(200).json({
      error: false,
      messages: "Logbook updated successfully",
      data: updatedLogbook,
    });
  } catch (err) {
    logger.error(`Error updating logbook: ${err.message}`);
    if (err.code === "P2025") {
      return res.status(404).json({
        error: true,
        messages: "Logbook not found",
      });
    }
    res.status(500).json({
      error: true,
      messages: "Internal server error",
    });
  }
};

exports.deleteLogbook = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.logbook.delete({
      where: { id },
    });

    res.status(200).json({
      error: false,
      messages: "Logbook deleted successfully",
    });
  } catch (err) {
    logger.error(`Error deleting logbook: ${err.message}`);
    if (err.code === "P2025") {
      return res.status(404).json({
        error: true,
        messages: "Logbook not found",
      });
    }
    res.status(500).json({
      error: true,
      messages: "Internal server error",
    });
  }
};

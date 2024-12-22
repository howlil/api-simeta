const prisma = require("../configs/db");
const { logger } = require("../utils/logging");
const { createLogbookSchema, updateLogbookSchema } = require("../validations/loogbook.validation.js");

exports.createLogbook = async (req, res) => {
  try {
    logger.info("Create logbook process started");

    // 1. Ambil TA ID
    const ta_id = req.user?.ta?.id;
    if (!ta_id) {
      logger.warn("User has no TA registered");
      return res.status(400).json({
        error: true,
        messages: "Daftar TA dulu",
      });
    }
    logger.info(`TA ID found: ${ta_id}`);

    // 2. Log request body
    logger.info("Request body received", req.body);

    // 3. Validasi input menggunakan schema
    try {
      await createLogbookSchema.validate(req.body, { abortEarly: false });
    } catch (validationError) {
      const errorMessages = validationError.inner.map((err) => err.message);
      logger.warn("Validation failed", { errors: errorMessages });
      return res.status(400).json({
        error: true,
        messages: errorMessages,
      });
    }

    // 4. Tambahkan date jika tidak disediakan
    const logbookData = {
      ...req.body,
      ta_id,
      date: req.body.date || new Date().toISOString().split("T")[0], // Default ke YYYY-MM-DD jika tidak ada
    };

    logger.info("Creating logbook with data", logbookData);

    // 5. Simpan logbook ke database
    const logbook = await prisma.logbook.create({
      data: logbookData,
    });

    logger.info("Logbook created successfully", { logbookId: logbook.id });

    // 6. Response sukses
    res.status(201).json({
      error: false,
      messages: "Logbook created successfully",
      data: logbook,
    });
  } catch (err) {
    logger.error(`Error creating logbook: ${err.message}`, { error: err });
    res.status(500).json({
      error: true,
      messages: "Terjadi kesalahan saat membuat logbook",
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
    logger.info("Update logbook process started");

    // 1. Ambil ID logbook dari parameter
    const { id } = req.params;
    logger.info(`Received logbook ID: ${id}`);

    // 2. Log request body
    logger.info("Request body received for update", req.body);

    const ta_id = req.user?.ta?.id;
    if (!ta_id) {
      logger.warn("User has no TA registered");
      return res.status(400).json({
        error: true,
        messages: "Daftar TA dulu",
      });
    }

    // 3. Validasi input menggunakan schema
    let validatedData;
    try {
      validatedData = await updateLogbookSchema.validate(req.body, { abortEarly: false });
      logger.info("Validation successful", validatedData);
    } catch (validationError) {
      const errorMessages = validationError.inner.map((err) => err.message);
      logger.warn("Validation failed", { errors: errorMessages });
      return res.status(400).json({
        error: true,
        messages: errorMessages,
      });
    }

    // Tambahkan ta_id ke validatedData
    validatedData = { ...validatedData, ta_id };

    // 4. Proses update logbook
    logger.info(`Updating logbook with ID: ${id}`);
    const updatedLogbook = await prisma.logbook.update({
      where: { id },
      data: validatedData,
    });

    logger.info("Logbook updated successfully", { logbookId: updatedLogbook.id });

    res.status(200).json({
      error: false,
      messages: "Logbook updated successfully",
      data: updatedLogbook,
    });
  } catch (err) {
    logger.error(`Error updating logbook: ${err.message}`, { error: err });

    // Tangani kesalahan Prisma ketika ID tidak ditemukan
    if (err.code === "P2025") {
      logger.warn(`Logbook with ID ${req.params.id} not found`);
      return res.status(404).json({
        error: true,
        messages: "Logbook not found",
      });
    }

    res.status(500).json({
      error: true,
      messages: err.message,
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

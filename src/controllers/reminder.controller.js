const prisma = require("../configs/db");
const { createReminderSchema, updateReminderSchema } = require("../validations/reminder.validation");
const { logger } = require("../utils/logging");

// CREATE Reminder
exports.createReminder = async (req, res) => {
  try {
    const { error, messages, data } = await createReminderSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ error: true, messages });
    }

    const reminder = await prisma.reminder.create({
      data: {
        ...data,
        mahasiswa_id: req.user.id, // ID pengguna yang membuat pengingat
      },
    });

    logger.info(`Reminder created successfully by user ${req.user.id}`);
    res.status(201).json({
      error: false,
      messages: "Reminder created successfully",
      data: reminder,
    });
  } catch (err) {
    logger.error(`Error creating reminder: ${err.message}`);
    res.status(500).json({
      error: true,
      messages: "Internal server error",
    });
  }
};

// GET All Reminders by User
exports.getReminders = async (req, res) => {
  try {
    const reminders = await prisma.reminder.findMany({
      where: { mahasiswa_id: req.user.id },
    });

    res.status(200).json({
      error: false,
      messages: "Success",
      data: reminders,
    });
  } catch (err) {
    logger.error(`Error retrieving reminders: ${err.message}`);
    res.status(500).json({
      error: true,
      messages: "Internal server error",
    });
  }
};

// UPDATE Reminder
exports.updateReminder = async (req, res) => {
  try {
    const { id } = req.params;

    const { error, messages, data } = await updateReminderSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ error: true, messages });
    }

    // Periksa apakah pengingat adalah milik pengguna
    const reminder = await prisma.reminder.findUnique({
      where: { id },
    });

    if (!reminder || reminder.mahasiswa_id !== req.user.id) {
      return res.status(403).json({
        error: true,
        messages: "You are not authorized to update this reminder",
      });
    }

    const updatedReminder = await prisma.reminder.update({
      where: { id },
      data,
    });

    logger.info(`Reminder ${id} updated successfully by user ${req.user.id}`);
    res.status(200).json({
      error: false,
      messages: "Reminder updated successfully",
      data: updatedReminder,
    });
  } catch (err) {
    logger.error(`Error updating reminder: ${err.message}`);
    res.status(500).json({
      error: true,
      messages: "Internal server error",
    });
  }
};

// DELETE Reminder
exports.deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;

    // Periksa apakah pengingat adalah milik pengguna
    const reminder = await prisma.reminder.findUnique({
      where: { id },
    });

    if (!reminder || reminder.mahasiswa_id !== req.user.id) {
      return res.status(403).json({
        error: true,
        messages: "You are not authorized to delete this reminder",
      });
    }

    await prisma.reminder.delete({
      where: { id },
    });

    logger.info(`Reminder ${id} deleted successfully by user ${req.user.id}`);
    res.status(200).json({
      error: false,
      messages: "Reminder deleted successfully",
    });
  } catch (err) {
    logger.error(`Error deleting reminder: ${err.message}`);
    res.status(500).json({
      error: true,
      messages: "Internal server error",
    });
  }
};

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

    if (new Date(req.body.due_date) < new Date()) {
      return res.status(400).json({
        error: true,
        messages: "Due date must be in the future",
      });
    }

    const response = await prisma.reminder.create({
      data: {
        ...req.body,
        mahasiswa_id: req.user.id, // ID pengguna yang membuat pengingat
      },
    });

    logger.info(`Reminder created successfully by user ${req.user.id}`);
    res.status(201).json({
      error: false,
      messages: "Reminder created successfully",
      data: response,
    });
  } catch (err) {
    logger.error(`Error creating reminder: ${err.message}`);
    res.status(500).json({
      error: true,
      messages: "Internal server error",
    });
  }
};

exports.getReminderDetail = async (req, res) => {
  try {
    const { id } = req.params; // ID reminder yang diminta

    // Cari reminder berdasarkan ID
    const reminder = await prisma.reminder.findUnique({
      where: { id },
      include: {
        mahasiswa: true, // Sertakan informasi mahasiswa terkait
      },
    });

    if (!reminder) {
      return res.status(404).json({
        error: true,
        messages: "Reminder not found",
      });
    }

    // Pastikan reminder milik pengguna saat ini
    if (reminder.mahasiswa_id !== req.user.id) {
      return res.status(403).json({
        error: true,
        messages: "You are not authorized to access this reminder",
      });
    }

    res.status(200).json({
      error: false,
      messages: "Success",
      data: {
        id: reminder.id,
        title: reminder.title,
        message: reminder.message,
        due_date: reminder.due_date,
        created_at: reminder.created_at,
        updated_at: reminder.updated_at,
        mahasiswa: {
          id: reminder.mahasiswa.id,
          full_name: reminder.mahasiswa.full_name,
          email: reminder.mahasiswa.email,
        },
      },
    });
  } catch (err) {
    logger.error(`Error retrieving reminder detail: ${err.message}`);
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
      orderBy: { due_date: 'asc' }, // Urutkan berdasarkan due_date
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

    const reminder = await prisma.reminder.findUnique({
      where: { id },
    });

    if (!reminder) {
      return res.status(404).json({
        error: true,
        messages: "Reminder not found",
      });
    }

    if (reminder.mahasiswa_id !== req.user.id) {
      return res.status(403).json({
        error: true,
        messages: "You are not authorized to update this reminder",
      });
    }

    // Validasi apakah due_date di masa depan jika diperbarui
    if (req.body.due_date && new Date(req.body.due_date) < new Date()) {
      return res.status(400).json({
        error: true,
        messages: "Due date must be in the future",
      });
    }

    const updatedReminder = await prisma.reminder.update({
      where: { id },
      ...req.body,
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

    const reminder = await prisma.reminder.findUnique({
      where: { id },
    });

    if (!reminder) {
      return res.status(404).json({
        error: true,
        messages: "Reminder not found",
      });
    }

    if (reminder.mahasiswa_id !== req.user.id) {
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

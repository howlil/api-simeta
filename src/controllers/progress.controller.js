const prisma = require("../configs/db");
const {
  createProgressSchema,
  updateProgressSchema,
} = require("../validations/progress.validation");
const { logger } = require("../utils/logging");
const { MILESTONE_STATUS } = require("../constants/status");
const admin = require("firebase-admin");

exports.createProgress = async (req, res) => {
  try {
    const { error, messages } = await createProgressSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ error: true, messages });
    }

    const { milestone_id, title, details } = req.body;

    // Cari milestone terkait
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestone_id },
      include: {
        ta: {
          include: {
            mahasiswa: true, // Termasuk mahasiswa untuk mengambil token FCM
          },
        },
      },
    });

    if (!milestone) {
      return res.status(404).json({
        error: true,
        messages: "Milestone not found",
      });
    }

    // Buat progress baru di Progress_TA
    const progress = await prisma.progress_TA.create({
      data: {
        title,
        details,
      },
    });

    // Hubungkan progress dengan milestone melalui Progress_Milestone_TA
    await prisma.progress_Milestone_TA.create({
      data: {
        milestone_id: milestone_id,
        progress_ta_id: progress.id,
        point: 50, // Tambahkan poin 50
      },
    });

    // Hitung total poin terkini di milestone
    const totalPoints = await prisma.progress_Milestone_TA.aggregate({
      _sum: {
        point: true,
      },
      where: { milestone_id },
    });

    // Perbarui poin dan status milestone
    const updatedPoints = totalPoints._sum.point || 0;
    let updatedStatus = milestone.status;

    if (updatedPoints >= milestone.max_point) {
      updatedStatus = "COMPLETED";
    } else if (updatedPoints > 0) {
      updatedStatus = "IN_PROGRESS";
    }

    await prisma.milestone.update({
      where: { id: milestone.id },
      data: {
        status: updatedStatus,
      },
    });

    // Jika milestone selesai, kirim notifikasi
    if (updatedStatus === "COMPLETED") {
      const mahasiswa = milestone.ta?.mahasiswa;
    
      if (mahasiswa?.fcmToken) {
        const message = {
          token: mahasiswa.fcmToken,
          notification: {
            title: "Milestone Completed",
            body: `Selamat! Anda telah menyelesaikan milestone "${milestone.name}".`,
          },
          data: {
            milestoneId: milestone.id,
            milestoneName: milestone.name,
            status: updatedStatus,
            completionDate: new Date().toISOString().split("T")[0], // Tanggal hari ini
          },
        };
    
        try {
          console.log(`Preparing to send notification to FCM token: ${mahasiswa.fcmToken}`);
          const response = await admin.messaging().send(message);
          console.log("Notification sent successfully:", response);
        } catch (err) {
          console.error("Error sending notification:", err);
        }
      } else {
        console.warn("No FCM token available for this user");
      }
    }

    logger.info("Progress TA created and milestone updated successfully");
    res.status(201).json({
      error: false,
      messages: "Progress TA created successfully",
      data: {
        progress,
        milestone: {
          id: milestone.id,
          status: updatedStatus,
          total_points: updatedPoints,
        },
      },
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
      include: {
        progress_Milestone: {
          where: { milestone_id },
          include: {
            milestone: true,
          },
        },
      },
    });

    if (!progressList.length) {
      return res.status(404).json({
        error: true,
        messages: "No progress found for this milestone",
      });
    }

    res.status(200).json({
      error: false,
      messages: "Success",
      data: progressList,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      messages: "Internal server error",
    });
  }
};

exports.getProgressDetail = async (req, res) => {
  try {
    const { id } = req.params; // ID progress yang diminta

    // Cari detail progress berdasarkan ID
    const progressDetail = await prisma.progress_TA.findUnique({
      where: { id },
      include: {
        progress_Milestone: {
          include: {
            milestone: true, // Sertakan informasi milestone terkait
          },
        },
      },
    });

    if (!progressDetail) {
      return res.status(404).json({
        error: true,
        messages: "Progress not found",
      });
    }

    const formattedResponse = {
      id: progressDetail.id,
      title: progressDetail.title,
      details: progressDetail.details,
      created_at: progressDetail.created_at,
      updated_at: progressDetail.updated_at,
      milestones: progressDetail.progress_Milestone.map((item) => ({
        milestone_id: item.milestone.id,
        milestone_name: item.milestone.name,
        milestone_description: item.milestone.description,
        milestone_status: item.milestone.status,
        point: item.point,
        max_point: item.milestone.max_point,
      })),
    };

    res.status(200).json({
      error: false,
      messages: "Success",
      data: formattedResponse,
    });
  } catch (err) {
    logger.error(`Error retrieving progress detail: ${err.message}`);
    res.status(500).json({
      error: true,
      messages: "Internal server error",
    });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, messages, data } = await updateProgressSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({ error: true, messages });
    }
    const {title,details} = req.body

    const progress = await prisma.progress_TA.update({
      where: { id },
      data: {
        title,
        details
      },
    });

    res.status(200).json({
      error: false,
      messages: "Progress TA updated successfully",
      data: progress,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      messages: "Internal server error",
    });
  }
};


exports.deleteProgress = async (req, res) => {
  try {
    const { id } = req.params;

    const progressMilestone = await prisma.progress_Milestone_TA.findUnique({
      where: { progress_ta_id: id },
    });

    if (!progressMilestone) {
      return res.status(404).json({
        error: true,
        messages: "Progress not found",
      });
    }

    await prisma.progress_TA.delete({
      where: { id },
    });

    const totalPoints = await prisma.progress_Milestone_TA.aggregate({
      _sum: { point: true },
      where: { milestone_id: progressMilestone.milestone_id },
    });

    const updatedPoints = totalPoints._sum.point || 0;
    let updatedStatus = MILESTONE_STATUS.NOT_STARTED;

    if (updatedPoints > 0) {
      updatedStatus = MILESTONE_STATUS.IN_PROGRESS;
    }

    await prisma.milestone.update({
      where: { id: progressMilestone.milestone_id },
      data: { status: updatedStatus },
    });

    res.status(200).json({
      error: false,
      messages: "Progress TA deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      messages: "Internal server error",
    });
  }
};

exports.getProgressAll = async (req, res) => {
  try {
    const { milestone_id } = req.query; // Filter berdasarkan milestone_id jika disediakan

    // Query progress dengan filter opsional
    const progressList = await prisma.progress_TA.findMany({
      where: milestone_id
        ? {
            progress_Milestone: {
              some: { milestone_id },
            },
          }
        : undefined, // Jika milestone_id tidak disediakan, ambil semua progress
      include: {
        progress_Milestone: {
          include: {
            milestone: true, // Sertakan informasi milestone terkait
          },
        },
      },
    });

    if (!progressList.length) {
      return res.status(404).json({
        error: true,
        messages: milestone_id
          ? `No progress found for milestone ID: ${milestone_id}`
          : "No progress found",
      });
    }

    // Format response
    const formattedProgress = progressList.map((progress) => ({
      id: progress.id,
      title: progress.title,
      details: progress.details,
      created_at: progress.created_at,
      updated_at: progress.updated_at,
      milestones: progress.progress_Milestone.map((item) => ({
        milestone_id: item.milestone.id,
        milestone_name: item.milestone.name,
        milestone_description: item.milestone.description,
        milestone_status: item.milestone.status,
        point: item.point,
        max_point: item.milestone.max_point,
      })),
    }));

    res.status(200).json({
      error: false,
      messages: "Success",
      data: formattedProgress,
    });
  } catch (err) {
    logger.error(`Error retrieving progress: ${err.message}`);
    res.status(500).json({
      error: true,
      messages: "Internal server error",
    });
  }
};

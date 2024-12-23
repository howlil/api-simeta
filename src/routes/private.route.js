const express = require("express");
const logbookController = require("../controllers/logbook.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const progressController = require("../controllers/progress.controller");
const milestoneController = require("../controllers/milestone.controller.js")
const reminderController = require("../controllers/reminder.controller");
const authController = require("../controllers/auth.controller.js");
const bimbinganController = require("../controllers/bimbingan.controller.js");
const {uploadPDF} = require("../middlewares/file.middleware.js")

const router = express.Router();

router.use(authenticate)

// loogbook
router.post("/api/v1/logbook",uploadPDF, logbookController.createLogbook);
router.get("/api/v1/logbooks", logbookController.getLogbooks);
router.get("/api/v1/logbooks/:id", logbookController.getLogbookById);
router.patch("/api/v1/logbooks/:id", logbookController.updateLogbook);
router.delete("/api/v1/logbook/:id", logbookController.deleteLogbook);

router.get("/api/v1/me", authController.me);
router.get("/api/v1/dashboard", authController.dashboard);

// Progress TA Routes
router.post("/api/v1/progress", progressController.createProgress);
router.get("/api/v1/progress/:milestone_id", progressController.getProgressByMilestone);
router.put("/api/v1/progress/:id", progressController.updateProgress);
router.get("/api/v1/progress/:id", progressController.getProgressDetail);
router.get("/api/v1/progress", progressController.getProgressAll);
router.delete("/api/v1/progress/:id", progressController.deleteProgress);

// Reminder Routes
router.post("/api/v1/reminder",  reminderController.createReminder);
router.get("/api/v1/reminders",  reminderController.getReminders);
router.get("/api/v1/reminder/:id",  reminderController.getReminderDetail);
router.put("/api/v1/reminders/:id",  reminderController.updateReminder);
router.delete("/api/v1/reminders/:id",  reminderController.deleteReminder);

//milestone
router.get("/api/v1/milestones",milestoneController.getMilestonesByTA)


router.post("/bimbingan/:ta_id",  bimbinganController.createBimbingan);

router.get("/bimbingan/:ta_id",  bimbinganController.getBimbinganByTA);

router.put("/bimbingan/:ta_id/:id",  bimbinganController.updateBimbingan);

router.delete("/bimbingan/:ta_id/:id", bimbinganController.deleteBimbingan);


module.exports = {router};

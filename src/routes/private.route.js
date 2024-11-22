const express = require("express");
const logbookController = require("../controllers/logbook.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const progressController = require("../controllers/progress.controller");
const milestoneController = require("../controllers/milestone.controller.js")
const reminderController = require("../controllers/reminder.controller");

const router = express.Router();

router.use(authenticate)

// loogbook
router.post("/api/v1/logbooks", logbookController.createLogbook);
router.get("/api/v1/logbooks", logbookController.getLogbooks);
router.get("/api/v1/logbooks/:id", logbookController.getLogbookById);
router.patch("/api/v1/logbooks/:id",  logbookController.updateLogbook);
router.get("/api/v1/logbooks/:id", logbookController.deleteLogbook);


// Progress TA Routes
router.post("/api/v1/progress", progressController.createProgress);
router.get("/api/v1/progress/:milestone_id", progressController.getProgressByMilestone);
router.put("/api/v1/progress/:id", progressController.updateProgress);
router.delete("/api/v1/progress/:id", progressController.deleteProgress);

// Reminder Routes
router.post("/api/v1/reminders",  reminderController.createReminder);
router.get("/api/v1/reminders",  reminderController.getReminders);
router.put("/api/v1/reminders/:id",  reminderController.updateReminder);
router.delete("/api/v1/reminders/:id",  reminderController.deleteReminder);

//milestone
router.get("/api/v1/milestones",milestoneController.getMilestonesByTA)

module.exports = {router};

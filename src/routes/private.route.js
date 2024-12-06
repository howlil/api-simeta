const express = require("express");
const logbookController = require("../controllers/logbook.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const progressController = require("../controllers/progress.controller");
const milestoneController = require("../controllers/milestone.controller.js")
const reminderController = require("../controllers/reminder.controller");
const guidanceController = require("../controllers/guidance.controller");
const activityController = require("../controllers/activity.controller");
const statusController = require("../controllers/status.controller");
const documentController = require("../controllers/document.controller");

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

// Guidance Routes
router.post("/api/v1/guidance", guidanceController.createGuidance);
router.get("/api/v1/guidance", guidanceController.getGuidanceSchedules);
router.get("/api/v1/guidance/:id", guidanceController.getGuidanceById);
router.patch("/api/v1/guidance/:id", guidanceController.updateGuidance);

// Activity Routes
router.post("/api/v1/activities", activityController.createActivity);
router.get("/api/v1/activities/:ta_id", activityController.getActivities);
router.get("/api/v1/activities/:id", activityController.getActivityById);
router.put("/api/v1/activities/:id", activityController.updateActivity);
router.delete("/api/v1/activities/:id", activityController.deleteActivity);

// Status Routes
router.get("/api/v1/status/:ta_id", statusController.getStatus);
router.patch("/api/v1/status/:ta_id", statusController.updateStatus);
router.get("/api/v1/status/overview/:ta_id", statusController.getStatusOverview);

// Document Routes
router.post("/api/v1/documents", documentController.createDocument);
router.get("/api/v1/documents/:ta_id", documentController.getDocuments);
router.get("/api/v1/documents/:id", documentController.getDocumentById);
router.put("/api/v1/documents/:id", documentController.updateDocument);
router.delete("/api/v1/documents/:id", documentController.deleteDocument);

module.exports = {router};

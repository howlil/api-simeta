
  // Status untuk model TA (Tugas Akhir)
  const TA_STATUS = {
    DRAFT: "draft",
    SUBMITTED: "submitted",
    APPROVED: "approved",
    REJECTED: "rejected",
    COMPLETED: "completed",
  };
  
  // Status untuk model Milestone
  const MILESTONE_STATUS = {
    NOT_STARTED: "not_started",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
  };
  
  // Status untuk model Progress_TA
  const PROGRESS_STATUS = {
    PENDING: "pending",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
  };
  
  // Status untuk model Reminder
  const REMINDER_STATUS = {
    PENDING: "pending",
    COMPLETED: "completed",
    EXPIRED: "expired",
  };
  

  
  const LOGBOOK_STATUS = {
    DRAFT: "draft",
    REJECTED : "rejected",
    FINALIZED: "finalized",
  };
  
  module.exports = {
    TA_STATUS,
    MILESTONE_STATUS,
    PROGRESS_STATUS,
    REMINDER_STATUS,
    LOGBOOK_STATUS,
  };
  
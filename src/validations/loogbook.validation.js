const yup = require("yup");

const createLogbookSchema = yup.object().shape({
  date: yup.string().required("Date is required"),
  activity: yup.string().required("Activity is required"),
  notes: yup.string().required("Notes are required"),
  attachment_url: yup.string().url("Attachment must be a valid URL").required("Attachment URL is required"),
  ta_id: yup.string().required("TA ID is required"),
});

const updateLogbookSchema = yup.object().shape({
  date: yup.string(),
  activity: yup.string(),
  notes: yup.string(),
  attachment_url: yup.string().url("Attachment must be a valid URL"),
  ta_id: yup.string(),
});

module.exports = { createLogbookSchema, updateLogbookSchema };

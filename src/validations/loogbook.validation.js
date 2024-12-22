const yup = require("yup");

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;


module.exports = {
  createLogbookSchema: yup.object().shape({
    date: yup
      .string()
      .matches(dateRegex, "Date must be in the format YYYY-MM-DD")
      .required("Date is required"),
    activity: yup.string().required("Activity is required"),
    notes: yup.string().required("Notes are required"),
    attachment_url: yup
      .string()
      .url("Attachment must be a valid URL")
      .required("Attachment URL is required"),
  }),
  
  updateLogbookSchema: yup.object().shape({
    date: yup.string().matches(dateRegex, "Date must be in the format YYYY-MM-DD"),
    activity: yup.string(),
    notes: yup.string(),
    attachment_url: yup.string().url("Attachment must be a valid URL"),
  })
};

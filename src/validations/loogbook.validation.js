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

  }),
  
  updateLogbookSchema: yup.object().shape({
    date: yup.string().matches(dateRegex, "Date must be in the format YYYY-MM-DD").optional(),
    activity: yup.string().optional(),
    notes: yup.string().optional(),
  })
};

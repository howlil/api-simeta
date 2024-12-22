const yup = require("yup");

module.exports = {
  createProgressSchema: yup.object().shape({
    milestone_id: yup
      .string()
      .uuid("Milestone ID must be a valid UUID")
      .required("Milestone ID is required"),
    title: yup
      .string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters"),
    details: yup
      .string()
      .max(1000, "Details cannot exceed 1000 characters")
      .required("Details are required"),
  }),

  updateProgressSchema: yup.object().shape({
    title: yup.string().min(3, "Title must be at least 3 characters"),
    details: yup.string().max(1000, "Details cannot exceed 1000 characters"),
  }),
};

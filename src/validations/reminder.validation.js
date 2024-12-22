const yup = require("yup");

module.exports = {
  createReminderSchema: yup.object().shape({
    title: yup
      .string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters"),
    message: yup
      .string()
      .required("Message is required")
      .min(5, "Message must be at least 5 characters"),
    due_date: yup
      .string()
      .required("Due date is required")
      .matches(
        /^\d{4}-\d{2}-\d{2}$/,
        "Due date must be in the format YYYY-MM-DD"
      ),
  }),

  updateReminderSchema: yup.object().shape({
    title: yup.string().min(3, "Title must be at least 3 characters"),
    message: yup.string().min(5, "Message must be at least 5 characters"),
    due_date: yup.string().matches(
      /^\d{4}-\d{2}-\d{2}$/,
      "Due date must be in the format YYYY-MM-DD"
    ),
  }),
};

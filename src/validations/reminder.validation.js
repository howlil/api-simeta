const yup = require("yup");

const createReminderSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  message: yup.string().required("Message is required"),
  due_date: yup
    .string()
    .matches(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,
      "Due date must be in ISO format (YYYY-MM-DDTHH:mm:ss)"
    )
    .required("Due date is required"),
});

const updateReminderSchema = yup.object().shape({
  title: yup.string(),
  message: yup.string(),
  due_date: yup.string().matches(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,
    "Due date must be in ISO format (YYYY-MM-DDTHH:mm:ss)"
  ),
});

module.exports = { createReminderSchema, updateReminderSchema };

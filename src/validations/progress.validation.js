const yup = require("yup");

const createProgressSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  details: yup.string().required("Details are required"),
  milestone_id: yup.string().required("Milestone ID is required"),
});

const updateProgressSchema = yup.object().shape({
  title: yup.string(),
  details: yup.string(),
  milestone_id: yup.string(),
});

module.exports = { createProgressSchema, updateProgressSchema };

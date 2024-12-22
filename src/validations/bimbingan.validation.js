const yup = require("yup");

module.exports = {
  createBimbinganSchema: yup.object().shape({
    tanggal: yup
      .string()
      .required("Tanggal is required")
      .matches(
        /^\d{4}-\d{2}-\d{2}$/,
        "Tanggal must be in the format YYYY-MM-DD"
      ),
    aktifitas: yup
      .string()
      .required("Aktifitas is required")
      .min(5, "Aktifitas must be at least 5 characters"),
    status: yup
      .string()
      .required("Status is required")
      .oneOf(["PENDING", "COMPLETED", "REJECTED"], "Invalid status"),
  }),

  updateBimbinganSchema: yup.object().shape({
    tanggal: yup
      .string()
      .optional()
      .matches(
        /^\d{4}-\d{2}-\d{2}$/,
        "Tanggal must be in the format YYYY-MM-DD"
      ),
    aktifitas: yup.string().optional().min(5, "Aktifitas must be at least 5 characters"),
    status: yup
      .string()
      .optional()
      .oneOf(["PENDING", "COMPLETED", "REJECTED"], "Invalid status"),
  }),
};

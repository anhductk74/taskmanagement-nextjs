import * as yup from "yup";

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split("T")[0];

// Create project validation schema
export const createProjectSchema: yup.ObjectSchema<any> = yup.object({
  name: yup
    .string()
    .required("Project name is required")
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must not exceed 100 characters"),

  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),

  startDate: yup
    .string()
    .required("Start date is required")
    .test(
      "not-in-past",
      "Start date cannot be in the past",
      (value) => !value || value >= today
    ),

  endDate: yup
    .string()
    .optional()
    .test(
      "not-in-past",
      "End date cannot be in the past",
      (value) => !value || value >= today
    )
    .test(
      "after-start-date",
      "End date must be after or equal to start date",
      function (value) {
        const { startDate } = this.parent;
        return !value || !startDate || value >= startDate;
      }
    ),

  pmEmail: yup
    .string()
    .required("Project manager email is required")
    .email("Invalid email format"),

  status: yup
    .string()
    .required("Status is required")
    .oneOf(
      ["Planned", "In Progress", "Blocked", "At Risk", "Completed", "Cancelled"],
      "Invalid status value"
    ),
});

// API request schema for backend
export const createProjectApiSchema = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
  startDate: yup.string().required(),
  endDate: yup.string().optional(),
  ownerId: yup.number().required(),
  emailPm: yup.string().required().email(),
  organizationId: yup.number().required(),
});

// Type definitions
export type CreateProjectFormData = yup.InferType<typeof createProjectSchema>;
export type CreateProjectApiData = yup.InferType<typeof createProjectApiSchema>;

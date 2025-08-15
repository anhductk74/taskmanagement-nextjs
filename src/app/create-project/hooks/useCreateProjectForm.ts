"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Định nghĩa kiểu dữ liệu form
export type FormData = {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  pmEmail: string;
  status: string;
};

// Lấy ngày hôm nay (định dạng yyyy-mm-dd)
const today = new Date().toISOString().split("T")[0];

// Tạo schema validate bằng Yup
const projectSchema: yup.ObjectSchema<FormData> = yup.object({
  name: yup.string().required("Project name is required"),
  description: yup.string().required("Description is required"),
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
        return !value || value >= startDate;
      }
    ),
  pmEmail: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  status: yup.string().required(),
});

export function useCreateProjectForm(onNameChange: (name: string) => void) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      pmEmail: "",
      status: "Planned",
    },
    resolver: yupResolver(projectSchema),
    mode: "onSubmit", // Có thể dùng "onTouched" hoặc "onBlur" tùy UX
  });

  const name = watch("name");
  const startDateValue = watch("startDate");

  useEffect(() => {
    onNameChange(name);
  }, [name, onNameChange]);

  const onSubmit = async (data: FormData) => {
    console.log("Creating project:", data);
    await new Promise((res) => setTimeout(res, 1000));
    alert(`Project "${data.name}" created`);
    router.push("/project/list");
    reset();
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    reset,
    today,
    startDateValue,
  };
}

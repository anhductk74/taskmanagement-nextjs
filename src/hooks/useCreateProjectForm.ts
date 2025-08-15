"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { createProjectSchema, CreateProjectFormData } from "@/components/modals/validator/createProjectSchema";
import { projectService } from "@/services/projects/projectService";

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split("T")[0];

export function useCreateProjectForm(onNameChange?: (name: string) => void) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectFormData>({
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      pmEmail: "",
      status: "Planned",
    },
    resolver: yupResolver(createProjectSchema),
    mode: "onSubmit",
  });

  const name = watch("name");
  const startDateValue = watch("startDate");

  useEffect(() => {
    if (onNameChange) {
      onNameChange(name);
    }
  }, [name, onNameChange]);

  const onSubmit = async (data: CreateProjectFormData) => {
    try {
      // Get user context and PM ID
      const [userContext, pmId] = await Promise.all([
        projectService.getUserContext(),
        projectService.getPMIdFromEmail(data.pmEmail)
      ]);

      // Transform form data to API format
      const apiData = {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate || undefined,
        ownerId: userContext.ownerId,
        pmId: pmId,
        organizationId: userContext.organizationId,
      };

      console.log("🚀 Creating project with API:", apiData);
      
      // Call project service
      const response = await projectService.createProject(apiData);
      
      console.log("✅ Project created successfully:", response);

      // Reset form and redirect
      reset();
      router.push("/dashboard/projects");
      
      return response;
    } catch (error: any) {
      console.error("❌ Failed to create project:", error);
      throw error;
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    reset,
    setValue,
    today,
    startDateValue,
  };
}

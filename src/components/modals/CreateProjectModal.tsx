"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import "@/app/globals.css";
import {
  Calendar,
  FileText,
  Mail,
  User,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import Input from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button";
import Dropdown, { DropdownItem } from "@/components/ui/Dropdown/Dropdown";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { useTheme } from "@/layouts/hooks/useTheme";
import { useProjects } from "@/hooks";
import { GrProjects } from "react-icons/gr";
import { createProjectSchema, CreateProjectFormData } from "./validator/createProjectSchema";
import { projectService } from "@/services/projects/projectService";
import { useSession } from "next-auth/react";
import toast from 'react-hot-toast';


/* ===================== Types ===================== */
// Using the imported CreateProjectFormData type from the schema

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject?: (projectData: ProjectFormData) => void;
}

interface ProjectFormData {
  name: string;
  privacy: string;
}

interface PrivacyOption {
  id: string;
  label: string;
  description: string;
  icon: string;
}

/* ===================== Privacy Options ===================== */
const PRIVACY_OPTIONS: PrivacyOption[] = [
  {
    id: "workspace",
    label: "My workspace",
    description: "Visible to workspace members",
    icon: "🏢"
  },
  {
    id: "private",
    label: "Private to me",
    description: "Only visible to you",
    icon: "🔒"
  },
  {
    id: "team",
    label: "Team project", 
    description: "Visible to team members",
    icon: "👥"
  }
];

/* ===================== Main Component ===================== */
export default function CreateProjectModal({
  isOpen,
  onClose,
  onCreateProject
}: CreateProjectModalProps) {
  const { theme } = useTheme();
  const { addProject } = useProjects();
    // console.log("Role: ",useSession().data?.user?.role);

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

  const today = useMemo(() => formatYMD(new Date()), []);
  const startDateValue = watch("startDate");
  const statusValue = watch("status");

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isStartCalOpen, setIsStartCalOpen] = useState(false);
  const [isEndCalOpen, setIsEndCalOpen] = useState(false);
  const [startMonth, setStartMonth] = useState<Date>(new Date());
  const [endMonth, setEndMonth] = useState<Date>(new Date());

  const handleStatusChange = (status: string) => {
    setValue("status", status, { shouldDirty: true });
    setIsStatusOpen(false);
  };
  
  const onSubmit = async (data: CreateProjectFormData) => {
    try {
      // Get user context and PM ID
      const [userContext] = await Promise.all([
        projectService.getUserContext(),
       
      ]);

      // Transform form data to API format
      const apiData = {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate || undefined,
        ownerId: userContext.ownerId,
        emailPm: data.pmEmail,
        organizationId: userContext.organizationId,
      };

      console.log("🚀 Creating project with API:", apiData);
      
      // Call project service
      const response = await projectService.createProject(apiData);
      
     alert(`Project created successfully!`);

      // Add to global projects system for UI consistency
      const randomColor = PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)];
      const newProject = {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        pmEmail: data.pmEmail,
        status: (() => {
          switch (data.status) {
            case "Completed":
              return "completed" as const;
            case "Cancelled":
              return "archived" as const;
            default:
              return "active" as const;
          }
        })(),
        color: randomColor,
        icon: GrProjects,
        tasksDue: 0,
      };

      addProject(newProject);

      reset();
      onClose();
      router.refresh();
    } catch (error: any) {
      console.error("Failed to create project:", error);
      // You can add toast notification here
      alert(`Failed to create project: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[600px] border"
        style={{
          borderColor: theme.border.default,
          color: theme.text.primary,
        }}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Create New Project</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="p-0"
              onClick={() => {
                onClose();
                reset();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */} 
          <div>
            <label className="font-medium flex items-center gap-1 mb-1">
              <FileText className="w-4 h-4" /> Project Name *
            </label>
            <Input
              leftIcon={<FileText className="w-4 h-4" />}
              error={!!errors.name}
              helperText={errors.name?.message?.toString()}
              {...register("name")}
              placeholder="Enter project name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-medium flex items-center gap-1 mb-1">
              <FileText className="w-4 h-4" /> Description
            </label>
            <Input
              leftIcon={<FileText className="w-4 h-4" />}
              {...register("description")}
              placeholder="Describe the project..."
            />
          </div>



          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="font-medium flex items-center gap-1 mb-1">
                <Calendar className="w-4 h-4" /> Start Date *
              </label>
              <div className="relative">
                <Dropdown
                  trigger={
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" />
                  }
                  isOpen={isStartCalOpen}
                  onOpenChange={setIsStartCalOpen}
                  placement="bottom-left"
                >
                  <CalendarPopover
                    month={startMonth}
                    setMonth={setStartMonth}
                    onSelect={(d) => {
                      const val = formatYMD(d);
                      setValue("startDate", val, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      setIsStartCalOpen(false);
                    }}
                    theme={theme}
                    todayYMD={today}
                  />
                </Dropdown>

                <Input
                  type="date"
                  min={today} // native guard
                  leftIcon={<Calendar className="w-4 h-4" />}
                  onClick={() => setIsStartCalOpen(true)}
                  className="pl-10 custom-date"
                  // placeholder="YYYY-MM-DD"
                  error={!!errors.startDate}
                  helperText={errors.startDate?.message?.toString()}
                  {...register("startDate")}
                />
              </div>
            </div>

            {/* Privacy */}
            <div className="mb-12">
              <label 
                className="block text-base font-medium mb-3"
                style={{ color: theme.text.primary }}
              >
                Privacy
              </label>
              <div className="relative">
                <Dropdown
                  trigger={
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" />
                  }
                  isOpen={isEndCalOpen}
                  onOpenChange={setIsEndCalOpen}
                  placement="bottom-left"
                >
                  <CalendarPopover
                    month={endMonth}
                    setMonth={setEndMonth}
                    minDate={startDateValue || today}
                    onSelect={(d) => {
                      const val = formatYMD(d);
                      if (startDateValue && val < startDateValue) return;
                      setValue("endDate", val, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      setIsEndCalOpen(false);
                    }}
                    theme={theme}
                    todayYMD={today}
                  />
                </Dropdown>

                <Input
                  type="date"
                  min={startDateValue || today} // native guard
                  leftIcon={<Calendar className="w-4 h-4" />}
                  onClick={() => setIsEndCalOpen(true)} 
                  className="pl-10 custom-date"
                  // placeholder="YYYY-MM-DD"
                  error={!!errors.endDate}
                  helperText={errors.endDate?.message?.toString()}
                  {...register("endDate")}
                />
              </div>
            </div>
          </div>

          {/* Email + Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* PM Email */}
            <div>
              <label className="font-medium flex items-center gap-1 mb-1">
                <Mail className="w-4 h-4" /> Project Manager Email *
              </label>
              <Input
                type="email"
                leftIcon={<Mail className="w-4 h-4" />}
                error={!!errors.pmEmail}
                helperText={errors.pmEmail?.message?.toString()}
                {...register("pmEmail")}
                placeholder="pm@company.com"
              />
            </div>

            {/* Status */}
            <div>
              <label className="font-medium flex items-center gap-1 mb-1">
                <User className="w-4 h-4" /> Project Status *
              </label>
              <Dropdown
                trigger={
                  <Button variant="outline" className="w-full justify-between text-white">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="text-white">{statusValue || "Select status"}</span>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                }
                className="w-full"
                isOpen={isStatusOpen}
                onOpenChange={setIsStatusOpen}
              >
                <div className="py-1">
                  {STATUS_OPTIONS.map((status) => (
                    <DropdownItem
                      key={status.label}
                      onClick={() => handleStatusChange(status.label)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{option.icon}</span>
                        <div>
                          <div 
                            className="font-medium"
                            style={{ color: theme.text.primary }}
                          >
                            {option.label}
                          </div>
                          <div 
                            className="text-xs"
                            style={{ color: theme.text.secondary }}
                          >
                            {option.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="flex-1"
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
            <Button
            className="text-white"
              type="button"
              onClick={() => {
                reset();
              }}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Preview Content - Centered */}
          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-md mx-auto">
              <div 
                className="w-full h-[480px] rounded-xl overflow-hidden shadow-2xl border"
                style={{ borderColor: theme.border.default }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/images/backgrounds/Updated_Dark_List.png"
                    alt="Project template preview"
                    fill
                    className="object-cover object-center"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}

/* ===================== Export Types ===================== */
export type { CreateProjectModalProps, ProjectFormData };
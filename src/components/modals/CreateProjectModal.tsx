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
}

const STATUS_OPTIONS = [
  { label: "Planned", color: "bg-blue-500" },
  { label: "In Progress", color: "bg-yellow-500" },
  { label: "Blocked", color: "bg-red-500" },
  { label: "At Risk", color: "bg-orange-500" },
  { label: "Completed", color: "bg-green-500" },
  { label: "Cancelled", color: "bg-gray-500" },
];

const PROJECT_COLORS = [
  "#8b5cf6", // Purple
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#84cc16", // Lime
  "#f97316", // Orange
  "#6366f1", // Indigo
];

/* ===================== Helpers ===================== */
const formatYMD = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getCalendarGrid = (monthDate: Date) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const start = new Date(firstDay);
  const startDay = firstDay.getDay(); // 0 = Sun
  start.setDate(firstDay.getDate() - startDay);

  const days: Date[] = [];
  const current = new Date(start);
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
};

/* ===================== Stateless Subcomponents ===================== */
const MonthLabel: React.FC<{ date: Date }> = ({ date }) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    <span className="font-semibold">
      {months[date.getMonth()]} {date.getFullYear()}
    </span>
  );
};

const CalendarPopover: React.FC<{
  month: Date;
  setMonth: (d: Date) => void;
  onSelect: (d: Date) => void;
  minDate?: string; // YYYY-MM-DD
  theme: ReturnType<typeof useTheme>["theme"];
  todayYMD: string;
}> = ({ month, setMonth, onSelect, minDate, theme, todayYMD }) => {
  const days = getCalendarGrid(month);
  const min = minDate ? new Date(minDate) : undefined;

  const isDisabled = (d: Date) =>
    min
      ? d < new Date(min.getFullYear(), min.getMonth(), min.getDate())
      : false;

  return (
    <div
      className="rounded-lg shadow-lg border p-3 w-72"
      style={{
        backgroundColor: theme.background.primary,
        borderColor: theme.border.default,
        color: theme.text.primary,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          className="p-1 rounded hover:bg-gray-600/20"
          onClick={() =>
            setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
          }
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <MonthLabel date={month} />
        <button
          type="button"
          className="p-1 rounded hover:bg-gray-600/20"
          onClick={() =>
            setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
          }
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs mb-1 opacity-70">
        {"SUN MON TUE WED THU FRI SAT".split(" ").map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d, idx) => {
          const inMonth = d.getMonth() === month.getMonth();
          const isToday = formatYMD(d) === todayYMD;
          const disabled = isDisabled(d) || !inMonth;

          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(d)}
              className={`h-8 rounded text-sm ${
                disabled
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-gray-600/20"
              } ${isToday ? "ring-1" : ""}`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ===================== Main Component ===================== */
export default function CreateProjectModal({ isOpen, onClose }: Props) {
  const router = useRouter();
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

            {/* End Date */}
            <div>
              <label className="font-medium flex items-center gap-1 mb-1">
                <Calendar className="w-4 h-4" /> End Date (Optional)
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
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${status.color}`}
                        />
                        {status.label}
                      </div>
                    </DropdownItem>
                  ))}
                </div>
              </Dropdown>
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
              variant="outline"
              size="lg"
            >
              Clear
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import clsx from "clsx";
import { useTheme } from "@/layouts/hooks/useTheme";

type Variant = "ghost" | "solid";

interface CreateProjectButtonProps {
  variant?: Variant;
  className?: string;
}

const CreateProjectButton: React.FC<CreateProjectButtonProps> = ({
  variant = "solid",
  className = "",
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  const handleClick = () => {
    router.push("/create-project");
  };

  if (variant === "ghost") {
    return (
      <div
        onClick={handleClick}
        className={clsx(
          "flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition text-center h-16 w-full",
          className
        )}
        style={{
          borderColor: theme.border.default,
          backgroundColor: "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.background.secondary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <Plus className="w-5 h-5" style={{ color: theme.text.secondary }} />
        <span
          className="text-sm mt-1"
          style={{ color: theme.text.secondary }}
        >
          Create project
        </span>
      </div>
    );
  }

  // Solid button
  return (
    <button
      onClick={handleClick}
      className={clsx(
        "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition",
        className
      )}
    >
      <Plus size={16} />
      Create project
    </button>
  );
};

export default CreateProjectButton;

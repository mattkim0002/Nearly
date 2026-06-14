"use client";

import { RefObject } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  isActive?: boolean;
  isInactive?: boolean;
  onClick?: () => void;
  inputRef?: RefObject<HTMLInputElement>;
  readOnly?: boolean;
  displayValue?: string;
}

export function SearchField({
  label,
  placeholder,
  value,
  onChange,
  className,
  isActive,
  isInactive,
  onClick,
  inputRef,
  readOnly,
  displayValue,
}: SearchFieldProps) {
  return (
    <div
      className={cn(
        "flex flex-col px-6 py-3 rounded-full cursor-pointer transition-all duration-200",
        isActive && "bg-white shadow-md",
        isInactive && "opacity-50",
        !isActive && !isInactive && "hover:bg-muted",
        className
      )}
      onClick={onClick}
    >
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <Input
        ref={inputRef}
        className="bg-transparent border-none p-0 h-auto focus-visible:ring-0 text-sm font-normal placeholder:text-muted-foreground/60 cursor-pointer"
        placeholder={placeholder}
        type="text"
        value={readOnly ? (displayValue ?? "") : value}
        onChange={readOnly ? undefined : (e) => onChange(e.target.value)}
        readOnly={readOnly}
      />
    </div>
  );
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

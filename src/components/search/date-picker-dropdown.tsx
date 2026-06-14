"use client";

import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerDropdownProps {
  selected: Date | null;
  onSelect: (date: Date) => void;
  variant?: "dropdown" | "inline";
}

export function DatePickerDropdown({ selected, onSelect, variant = "dropdown" }: DatePickerDropdownProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-xl border border-border p-4 z-50",
        variant === "dropdown" && "absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[660px]",
        variant === "inline" && "w-full mt-2"
      )}
    >
      <DayPicker
        mode="single"
        numberOfMonths={variant === "dropdown" ? 2 : 1}
        selected={selected ?? undefined}
        onSelect={(date) => date && onSelect(date)}
        disabled={{ before: new Date() }}
        classNames={{
          // Layout
          root: "text-sm select-none",
          months: "relative flex gap-8",
          month: "w-full",

          // Caption row
          month_caption: "flex items-center justify-center h-10 mb-1",
          caption_label: "text-sm font-semibold",

          // Navigation — absolutely positioned over both captions
          nav: "absolute inset-x-0 top-0 flex items-center justify-between pointer-events-none",
          button_previous:
            "size-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-default pointer-events-auto",
          button_next:
            "size-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-default pointer-events-auto",

          // Table — v9 renders a real <table> so column widths come from th/td
          month_grid: "w-full border-collapse",
          weekdays: "", // <tr> — no styles needed; table handles layout
          weekday: "w-10 h-8 text-center text-[11px] font-medium text-muted-foreground",
          weeks: "", // <tbody>
          week: "", // <tr>
          day: "p-0 text-center", // <td>
          day_button:
            "w-10 h-10 rounded-full text-sm hover:bg-muted transition-colors font-normal",

          // State modifiers — applied to the day_button via modifiersClassNames below
          selected: "",
          today: "font-bold",
          outside: "opacity-30",
          disabled: "opacity-30 cursor-default pointer-events-none",
          hidden: "invisible",

          // Animation keys (required by ClassNames type, unused)
          weeks_before_enter: "",
          weeks_before_exit: "",
          weeks_after_enter: "",
          weeks_after_exit: "",
          caption_after_enter: "",
          caption_after_exit: "",
          caption_before_enter: "",
          caption_before_exit: "",
          chevron: "",
        }}
        modifiersClassNames={{
          selected: "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold",
        }}
        components={{
          Chevron: ({ orientation }) =>
            orientation === "left" ? (
              <ChevronLeft className="size-5" />
            ) : (
              <ChevronRight className="size-5" />
            ),
        }}
      />
    </div>
  );
}

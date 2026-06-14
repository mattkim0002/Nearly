"use client";

import { Camera, Hammer, CircleDot, Paintbrush, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { label: "Photography", slug: "photography", icon: Camera },
  { label: "Woodworking", slug: "woodworking", icon: Hammer },
  { label: "Ceramics", slug: "ceramics", icon: CircleDot },
  { label: "Illustration", slug: "illustration", icon: Paintbrush },
  { label: "Interior Design", slug: "interior-design", icon: Home },
];

interface ServiceSuggestionsProps {
  onSelect: (label: string, slug: string) => void;
  variant?: "dropdown" | "inline";
}

export function ServiceSuggestions({ onSelect, variant = "dropdown" }: ServiceSuggestionsProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-xl border border-border p-4 z-50",
        variant === "dropdown" && "absolute top-full right-0 mt-2 w-72",
        variant === "inline" && "w-full mt-2"
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
        Categories
      </p>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(({ label, slug, icon: Icon }) => (
          <button
            key={slug}
            className="flex items-center gap-2 px-3 py-2 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors"
            onClick={() => onSelect(label, slug)}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

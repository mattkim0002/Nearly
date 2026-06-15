"use client";

import { useRef, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchField, formatDate } from "./search-field";
import { LocationDropdown } from "./location-dropdown";
import { DatePickerDropdown } from "./date-picker-dropdown";
import { ServiceSuggestions } from "./service-suggestions";
import { cn } from "@/lib/utils";

export interface SearchValues {
  where: string;
  when: Date | null;
  service: string;
  category: string; // category slug — set when a chip is selected, cleared when user types freely
}

type ActiveField = "where" | "when" | "service" | null;

interface SearchBarDesktopProps {
  values: SearchValues;
  onChange: (values: SearchValues) => void;
  onSearch?: () => void;
}

export function SearchBarDesktop({ values, onChange, onSearch }: SearchBarDesktopProps) {
  const [activeField, setActiveField] = useState<ActiveField>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) {
        setActiveField(null);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  const whereActive = activeField === "where";
  const whenActive = activeField === "when";
  const serviceActive = activeField === "service";

  return (
    <div
      ref={pillRef}
      className={cn(
        "w-full max-w-[840px] bg-card rounded-full p-2 flex items-center border border-border transition-shadow duration-200",
        activeField ? "shadow-2xl" : "shadow-md"
      )}
    >
      {/* Where */}
      <div className="relative flex-1">
        <SearchField
          label="Where"
          placeholder="Search destinations"
          value={values.where}
          onChange={(where) => onChange({ ...values, where })}
          isActive={whereActive}
          isInactive={activeField !== null && !whereActive}
          onClick={() => setActiveField("where")}
        />
        {whereActive && (
          <LocationDropdown
            query={values.where}
            onSelect={(loc) => {
              onChange({ ...values, where: loc });
              setActiveField("when");
            }}
            variant="dropdown"
          />
        )}
      </div>

      {/* Divider */}
      <div
        className={cn(
          "w-px h-8 bg-border transition-opacity duration-200",
          (whereActive || whenActive) && "opacity-0"
        )}
      />

      {/* When */}
      <div className="relative flex-1">
        <SearchField
          label="When"
          placeholder="Add dates"
          value=""
          onChange={() => {}}
          readOnly
          displayValue={values.when ? formatDate(values.when) : ""}
          isActive={whenActive}
          isInactive={activeField !== null && !whenActive}
          onClick={() => setActiveField("when")}
        />
        {whenActive && (
          <DatePickerDropdown
            selected={values.when}
            onSelect={(date) => {
              onChange({ ...values, when: date });
              setActiveField("service");
            }}
            variant="dropdown"
          />
        )}
      </div>

      {/* Divider */}
      <div
        className={cn(
          "w-px h-8 bg-border transition-opacity duration-200",
          (whenActive || serviceActive) && "opacity-0"
        )}
      />

      {/* Service */}
      <div className="relative flex-[1.2]">
        <SearchField
          label="Service"
          placeholder="What are you looking for?"
          value={values.service}
          onChange={(service) => onChange({ ...values, service, category: "" })}
          isActive={serviceActive}
          isInactive={activeField !== null && !serviceActive}
          onClick={() => setActiveField("service")}
        />
        {serviceActive && (
          <ServiceSuggestions
            onSelect={(label, slug) => {
              onChange({ ...values, service: label, category: slug });
              setActiveField(null);
            }}
            variant="dropdown"
          />
        )}
      </div>

      {/* Search Button */}
      <Button
        size="icon"
        className="bg-primary text-primary-foreground size-14 rounded-full hover:scale-105 transition-transform shadow-lg ml-auto mr-1 shrink-0"
        onClick={() => {
          setActiveField(null);
          onSearch?.();
        }}
      >
        <Search className="size-5" />
      </Button>
    </div>
  );
}

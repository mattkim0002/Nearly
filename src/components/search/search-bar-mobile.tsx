"use client";

import { useState, useEffect } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocationDropdown } from "./location-dropdown";
import { DatePickerDropdown } from "./date-picker-dropdown";
import { ServiceSuggestions } from "./service-suggestions";
import { formatDate } from "./search-field";
import { cn } from "@/lib/utils";
import type { SearchValues } from "./search-bar-desktop";

type AccordionField = "where" | "when" | "service";

interface SearchBarMobileProps {
  values: SearchValues;
  onChange: (values: SearchValues) => void;
  onSearch?: () => void;
}

export function SearchBarMobile({ values, onChange, onSearch }: SearchBarMobileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeField, setActiveField] = useState<AccordionField>("where");

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      setActiveField("where");
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSearch = () => {
    setIsOpen(false);
    onSearch?.();
  };

  const displayText =
    values.where ||
    values.service ||
    (values.when ? formatDate(values.when) : "") ||
    "Who are you looking for?";

  return (
    <>
      {/* Collapsed Pill */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full max-w-[400px] bg-card rounded-full shadow-2xl p-4 flex items-center gap-3 border border-border hover:shadow-lg transition-shadow"
      >
        <Search className="size-5 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground truncate">{displayText}</span>
      </button>

      {/* Bottom Sheet Modal */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />

        <div
          className={cn(
            "absolute inset-x-0 bottom-0 bg-background rounded-t-3xl transition-transform duration-300 ease-out overflow-y-auto",
            isOpen ? "translate-y-0" : "translate-y-full"
          )}
          style={{ maxHeight: "90dvh" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="size-5" />
            </button>
            <span className="font-semibold">Search</span>
            <div className="w-9" />
          </div>

          {/* Accordion Fields */}
          <div className="p-4 space-y-2">
            {/* Where */}
            <AccordionSection
              label="Where"
              summary={values.where || "Search destinations"}
              isActive={activeField === "where"}
              onToggle={() => setActiveField(activeField === "where" ? "where" : "where")}
              onClick={() => setActiveField("where")}
            >
              <Input
                autoFocus
                className="mt-2"
                placeholder="Search destinations"
                value={values.where}
                onChange={(e) => onChange({ ...values, where: e.target.value })}
              />
              <LocationDropdown
                query={values.where}
                onSelect={(loc) => {
                  onChange({ ...values, where: loc });
                  setActiveField("when");
                }}
                variant="inline"
              />
            </AccordionSection>

            {/* When */}
            <AccordionSection
              label="When"
              summary={values.when ? formatDate(values.when) : "Add dates"}
              isActive={activeField === "when"}
              onClick={() => setActiveField("when")}
            >
              <DatePickerDropdown
                selected={values.when}
                onSelect={(date) => {
                  onChange({ ...values, when: date });
                  setActiveField("service");
                }}
                variant="inline"
              />
            </AccordionSection>

            {/* Service */}
            <AccordionSection
              label="Service"
              summary={values.service || "What are you looking for?"}
              isActive={activeField === "service"}
              onClick={() => setActiveField("service")}
            >
              <Input
                autoFocus={activeField === "service"}
                className="mt-2"
                placeholder="What are you looking for?"
                value={values.service}
                onChange={(e) => onChange({ ...values, service: e.target.value, category: "" })}
              />
              <ServiceSuggestions
                onSelect={(label, slug) => {
                  onChange({ ...values, service: label, category: slug });
                  setActiveField("service");
                }}
                variant="inline"
              />
            </AccordionSection>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Button className="w-full h-12 rounded-xl text-base font-semibold" onClick={handleSearch}>
              <Search className="size-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

interface AccordionSectionProps {
  label: string;
  summary: string;
  isActive: boolean;
  onClick: () => void;
  onToggle?: () => void;
  children: React.ReactNode;
}

function AccordionSection({ label, summary, isActive, onClick, children }: AccordionSectionProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-200",
        isActive ? "border-foreground bg-card" : "border-border bg-muted/30"
      )}
    >
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={onClick}
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className={cn("text-sm", isActive ? "font-medium" : "text-muted-foreground")}>{summary}</p>
        </div>
        <ChevronDown
          className={cn("size-4 text-muted-foreground transition-transform duration-200", isActive && "rotate-180")}
        />
      </button>

      {isActive && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { MapPin, Navigation, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const MAJOR_CITIES = [
  "Los Angeles",
  "San Diego",
  "Las Vegas",
  "San Francisco",
  "New York",
  "Miami",
  "Seattle",
  "Austin",
  "Portland",
  "Chicago",
];

interface LocationDropdownProps {
  query: string;
  onSelect: (loc: string) => void;
  variant?: "dropdown" | "inline";
}

export function LocationDropdown({ query, onSelect, variant = "dropdown" }: LocationDropdownProps) {
  const [results, setResults] = useState<string[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/locations?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleNearby = () => {
    if (!navigator.geolocation) {
      setLocationError(true);
      return;
    }
    setIsLocating(true);
    setLocationError(false);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            "Nearby";
          onSelect(city);
        } catch {
          onSelect("Nearby");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        setLocationError(true);
      },
      { timeout: 8000 }
    );
  };

  const containerClass = cn(
    "bg-white rounded-2xl shadow-xl border border-border py-2 z-50",
    variant === "dropdown" && "absolute top-full left-0 mt-2 w-80",
    variant === "inline" && "w-full mt-2"
  );

  // Autocomplete results when user has typed 2+ chars
  if (query.length >= 2) {
    if (results.length === 0) return null;
    return (
      <div className={containerClass}>
        {results.map((loc) => (
          <button
            key={loc}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-muted text-left transition-colors"
            onClick={() => onSelect(loc)}
          >
            <MapPin className="size-4 text-muted-foreground shrink-0" />
            <span>{loc}</span>
          </button>
        ))}
      </div>
    );
  }

  // Default view: Nearby + major cities
  return (
    <div className={containerClass}>
      {/* Nearby */}
      <button
        className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-muted text-left transition-colors disabled:opacity-60"
        onClick={handleNearby}
        disabled={isLocating}
      >
        <div className="size-9 rounded-full bg-muted flex items-center justify-center shrink-0">
          <Navigation className="size-4" />
        </div>
        <div>
          <p className="font-medium">{isLocating ? "Locating…" : "Nearby"}</p>
          {locationError ? (
            <p className="text-xs text-destructive">Location unavailable</p>
          ) : (
            <p className="text-xs text-muted-foreground">Use your current location</p>
          )}
        </div>
      </button>

      <div className="h-px bg-border mx-4 my-1" />

      <p className="px-4 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        Popular destinations
      </p>

      {MAJOR_CITIES.map((city) => (
        <button
          key={city}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-muted text-left transition-colors"
          onClick={() => onSelect(city)}
        >
          <Building2 className="size-4 text-muted-foreground shrink-0" />
          <span>{city}</span>
        </button>
      ))}
    </div>
  );
}

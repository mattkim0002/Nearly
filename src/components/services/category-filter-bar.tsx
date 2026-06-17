"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Search, X } from "lucide-react";

type SortOption = "newest" | "price_asc" | "price_desc";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
};

const PRICE_OPTIONS = [
  { label: "All prices", value: "" },
  { label: "Under $200", value: "max_200" },
  { label: "$200–$500", value: "min_200_max_500" },
  { label: "$500+", value: "min_500" },
];

function parsePriceParam(min?: string, max?: string): string {
  if (min === "500" && !max) return "min_500";
  if (min === "200" && max === "500") return "min_200_max_500";
  if (!min && max === "200") return "max_200";
  return "";
}

function encodePriceOption(option: string): { min?: string; max?: string } {
  if (option === "max_200") return { max: "200" };
  if (option === "min_200_max_500") return { min: "200", max: "500" };
  if (option === "min_500") return { min: "500" };
  return {};
}

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

export function CategoryFilterBar({
  categorySlug,
  basePath,
  categories,
  currentCategory,
  locations,
  currentSort,
  currentLocation,
  currentMinPrice,
  currentMaxPrice,
}: {
  categorySlug?: string;
  basePath?: string;
  categories?: CategoryOption[];
  currentCategory?: string;
  locations: string[];
  currentSort: SortOption;
  currentLocation?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sortOpen, setSortOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");

  const sortRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  const currentPriceOption = parsePriceParam(currentMinPrice, currentMaxPrice);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
      if (priceRef.current && !priceRef.current.contains(e.target as Node)) setPriceOpen(false);
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setLocationOpen(false);
        setLocationSearch("");
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) setCategoryOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function buildUrl(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(overrides)) {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    // Always reset to page 1 when filters change
    params.set("page", "1");
    const base = basePath ?? `/categories/${categorySlug}`;
    return `${base}?${params.toString()}`;
  }

  function handleSort(sort: SortOption) {
    router.push(buildUrl({ sort }));
    setSortOpen(false);
  }

  function handlePrice(option: string) {
    const { min, max } = encodePriceOption(option);
    router.push(buildUrl({ min_price: min, max_price: max }));
    setPriceOpen(false);
  }

  function handleLocation(loc: string) {
    router.push(buildUrl({ location: loc }));
    setLocationOpen(false);
    setLocationSearch("");
  }

  function handleCategory(slug: string) {
    router.push(buildUrl({ category: slug || undefined }));
    setCategoryOpen(false);
  }

  const filteredLocations = locationSearch
    ? locations.filter((l) => l.toLowerCase().includes(locationSearch.toLowerCase()))
    : locations;

  const currentCategoryName = categories?.find((c) => c.slug === currentCategory)?.name;
  const hasActiveFilters = currentLocation || currentPriceOption || currentCategory;

  return (
    <div className="flex flex-wrap items-center gap-2 py-4 border-b border-border">
      {/* Category */}
      {categories && categories.length > 0 && (
        <div className="relative" ref={categoryRef}>
          <button
            onClick={() => setCategoryOpen((o) => !o)}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              currentCategory
                ? "bg-primary/10 border-primary text-primary"
                : "border-border hover:border-foreground"
            }`}
          >
            {currentCategoryName ?? "Category"}
            <ChevronDown className="size-3.5" />
          </button>
          {categoryOpen && (
            <div className="absolute left-0 top-full mt-2 z-20 bg-background border border-border rounded-xl shadow-lg min-w-[180px] py-1 overflow-hidden">
              <button
                onClick={() => handleCategory("")}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-accent transition-colors ${
                  !currentCategory ? "font-bold text-primary" : ""
                }`}
              >
                All categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleCategory(cat.slug)}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-accent transition-colors ${
                    currentCategory === cat.slug ? "font-bold text-primary" : ""
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sort */}
      <div className="relative" ref={sortRef}>
        <button
          onClick={() => setSortOpen((o) => !o)}
          className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
            currentSort !== "newest"
              ? "bg-primary/10 border-primary text-primary"
              : "border-border hover:border-foreground"
          }`}
        >
          {SORT_LABELS[currentSort]}
          <ChevronDown className="size-3.5" />
        </button>
        {sortOpen && (
          <div className="absolute left-0 top-full mt-2 z-20 bg-background border border-border rounded-xl shadow-lg min-w-[180px] py-1 overflow-hidden">
            {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([value, label]) => (
              <button
                key={value}
                onClick={() => handleSort(value)}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-accent transition-colors ${
                  currentSort === value ? "font-bold text-primary" : ""
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="relative" ref={priceRef}>
        <button
          onClick={() => setPriceOpen((o) => !o)}
          className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
            currentPriceOption
              ? "bg-primary/10 border-primary text-primary"
              : "border-border hover:border-foreground"
          }`}
        >
          {PRICE_OPTIONS.find((o) => o.value === currentPriceOption)?.label ?? "Price"}
          <ChevronDown className="size-3.5" />
        </button>
        {priceOpen && (
          <div className="absolute left-0 top-full mt-2 z-20 bg-background border border-border rounded-xl shadow-lg min-w-[180px] py-1 overflow-hidden">
            {PRICE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handlePrice(opt.value)}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-accent transition-colors ${
                  currentPriceOption === opt.value ? "font-bold text-primary" : ""
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Location */}
      <div className="relative" ref={locationRef}>
        <button
          onClick={() => setLocationOpen((o) => !o)}
          className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
            currentLocation
              ? "bg-primary/10 border-primary text-primary"
              : "border-border hover:border-foreground"
          }`}
        >
          {currentLocation ?? "Location"}
          <ChevronDown className="size-3.5" />
        </button>
        {locationOpen && (
          <div className="absolute left-0 top-full mt-2 z-20 bg-background border border-border rounded-xl shadow-lg w-64 overflow-hidden">
            <div className="p-2 border-b border-border">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-muted">
                <Search className="size-3.5 text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto py-1">
              <button
                onClick={() => handleLocation("")}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-accent transition-colors ${
                  !currentLocation ? "font-bold text-primary" : ""
                }`}
              >
                All locations
              </button>
              {filteredLocations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleLocation(loc)}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-accent transition-colors ${
                    currentLocation === loc ? "font-bold text-primary" : ""
                  }`}
                >
                  {loc}
                </button>
              ))}
              {filteredLocations.length === 0 && (
                <p className="px-4 py-3 text-sm text-muted-foreground">No locations found</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Clear all */}
      {hasActiveFilters && (
        <button
          onClick={() => router.push(basePath ?? `/categories/${categorySlug}`)}
          className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors ml-1"
        >
          <X className="size-3.5" />
          Clear
        </button>
      )}
    </div>
  );
}

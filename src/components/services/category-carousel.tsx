"use client";

import { useState } from "react";
import { CategorySection } from "./category-section";
import type { Database } from "@/types/database";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type Service = Database["public"]["Tables"]["services"]["Row"];

export function CategoryCarousel({
  categories,
  servicesByCategory,
}: {
  categories: Category[];
  servicesByCategory: Record<string, Service[]>;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex border-b border-border mb-10 overflow-x-auto hide-scrollbar gap-8">
        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => setActiveIndex(index)}
            className={`border-b-2 pb-4 font-bold text-sm whitespace-nowrap transition-colors ${
              index === activeIndex
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Sliding Content */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {categories.map((category) => (
            <div key={category.id} className="min-w-full">
              <CategorySection
                category={category}
                services={servicesByCategory[category.id] ?? []}
                slug={category.slug}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

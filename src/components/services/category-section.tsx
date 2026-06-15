"use client";

import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ServiceCard } from "./service-card";
import type { Database } from "@/types/database";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type Service = Database["public"]["Tables"]["services"]["Row"];

const SCROLL_AMOUNT = 312; // card width (288px) + gap (24px)

function ServiceRow({ services }: { services: Service[] }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState]);

  const handleScrollLeft = () => {
    rowRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
    setTimeout(updateScrollState, 350);
  };

  const handleScrollRight = () => {
    rowRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
    setTimeout(updateScrollState, 350);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleScrollLeft}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
        className={`shrink-0 p-2 rounded-full border transition-colors ${
          canScrollLeft
            ? "border-gray-300 text-gray-700 hover:bg-gray-100"
            : "border-gray-200 text-gray-300 cursor-not-allowed"
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div
        ref={rowRef}
        className="flex gap-6 overflow-x-auto hide-scrollbar pb-4"
        onScroll={updateScrollState}
      >
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      <button
        onClick={handleScrollRight}
        disabled={!canScrollRight}
        aria-label="Scroll right"
        className={`shrink-0 p-2 rounded-full border transition-colors ${
          canScrollRight
            ? "border-gray-300 text-gray-700 hover:bg-gray-100"
            : "border-gray-200 text-gray-300 cursor-not-allowed"
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

export function CategorySection({
  category,
  services,
  slug,
}: {
  category: Category;
  services: Service[];
  slug: string;
}) {
  if (services.length === 0) return null;

  const topRow = services.slice(0, 8);
  const bottomRow = services.slice(8, 16);

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-muted-foreground text-sm">
              {category.description}
            </p>
          )}
        </div>
        <Link
          href={`/categories/${slug}`}
          className="text-sm font-bold flex items-center gap-1 hover:underline whitespace-nowrap shrink-0"
        >
          View all
        </Link>
      </div>

      <ServiceRow services={topRow} />
      {bottomRow.length > 0 && (
        <div className="mt-2">
          <ServiceRow services={bottomRow} />
        </div>
      )}
    </section>
  );
}

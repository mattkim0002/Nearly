"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBarDesktop, type SearchValues } from "./search-bar-desktop";
import { SearchBarMobile } from "./search-bar-mobile";

export function HeroSearch() {
  const router = useRouter();
  const [searchValues, setSearchValues] = useState<SearchValues>({
    where: "",
    when: null,
    service: "",
    category: "",
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchValues.category)     params.set("category", searchValues.category);
    else if (searchValues.service) params.set("q", searchValues.service);
    if (searchValues.where)        params.set("location", searchValues.where);
    if (searchValues.when)         params.set("when", searchValues.when.toISOString().split("T")[0]);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <>
      {/* Desktop Search Bar */}
      <div className="hidden md:block w-full">
        <div className="flex justify-center">
          <SearchBarDesktop
            values={searchValues}
            onChange={setSearchValues}
            onSearch={handleSearch}
          />
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="block md:hidden w-full">
        <div className="flex justify-center">
          <SearchBarMobile
            values={searchValues}
            onChange={setSearchValues}
            onSearch={handleSearch}
          />
        </div>
      </div>
    </>
  );
}

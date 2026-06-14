import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ServiceCard } from "@/components/services/service-card";
import { CategoryFilterBar } from "@/components/services/category-filter-bar";
import { CategoryPagination } from "@/components/services/category-pagination";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type Service = Database["public"]["Tables"]["services"]["Row"];

const PAGE_SIZE = 12;

type SortOption = "newest" | "price_asc" | "price_desc";

function parseSort(raw: string | undefined): SortOption {
  if (raw === "price_asc" || raw === "price_desc") return raw;
  return "newest";
}

function pageTitle(q?: string, location?: string, categoryName?: string): string {
  if (categoryName) return categoryName;
  if (q) return `Results for "${q}"`;
  if (location) return `Services in ${location}`;
  return "All services";
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    location?: string;
    when?: string;
    page?: string;
    sort?: string;
    min_price?: string;
    max_price?: string;
  }>;
}) {
  const filters = await searchParams;

  const q = filters.q?.trim() || undefined;
  const category = filters.category?.trim() || undefined;
  const location = filters.location?.trim() || undefined;
  const page = Math.max(1, parseInt(filters.page ?? "1", 10) || 1);
  const sort = parseSort(filters.sort);
  const minPrice = filters.min_price ? parseInt(filters.min_price, 10) : undefined;
  const maxPrice = filters.max_price ? parseInt(filters.max_price, 10) : undefined;

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  // Resolve category slug → id + name
  let categoryId: string | undefined;
  let categoryName: string | undefined;
  if (category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id, name")
      .eq("slug", category)
      .maybeSingle() as { data: { id: string; name: string } | null; error: unknown };
    categoryId = cat?.id;
    categoryName = cat?.name;
  }

  // Fetch all categories for the filter bar
  const { data: allCategoriesData } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  let query = supabase.from("services").select("*", { count: "exact" });

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }
  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }
  if (location) {
    query = query.ilike("location", `%${location}%`);
  }
  if (minPrice !== undefined) {
    query = query.gte("price_starting", minPrice);
  }
  if (maxPrice !== undefined) {
    query = query.lte("price_starting", maxPrice);
  }

  if (sort === "price_asc") {
    query = query.order("price_starting", { ascending: true });
  } else if (sort === "price_desc") {
    query = query.order("price_starting", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  query = query.range(from, to);

  // Fetch locations scoped to active filters for relevance
  let locationsQuery = supabase.from("services").select("location");
  if (categoryId) locationsQuery = locationsQuery.eq("category_id", categoryId);
  if (q) locationsQuery = locationsQuery.or(`title.ilike.%${q}%,description.ilike.%${q}%`);

  const [servicesResult, locationsResult] = await Promise.all([query, locationsQuery]);

  const services = servicesResult.data as Service[] | null;
  const count = servicesResult.count;
  const locationRows = locationsResult.data as { location: string }[] | null;

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const allLocations = Array.from(
    new Set((locationRows ?? []).map((r) => r.location).filter(Boolean))
  ).sort() as string[];

  const baseUrl = `/search?${new URLSearchParams({
    ...(q && { q }),
    ...(category && { category }),
    ...(location && { location }),
    ...(sort !== "newest" && { sort }),
    ...(filters.min_price && { min_price: filters.min_price }),
    ...(filters.max_price && { max_price: filters.max_price }),
  }).toString()}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-20 py-10">

          {/* Page Header */}
          <div className="mb-2">
            <h1 className="text-4xl font-extrabold tracking-tight">{pageTitle(q, location, categoryName)}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {totalCount} {totalCount === 1 ? "service" : "services"}
              {location ? ` in ${location}` : ""}
            </p>
          </div>

          {/* Filter Bar */}
          <CategoryFilterBar
            basePath="/search"
            categories={allCategoriesData ?? []}
            currentCategory={category}
            locations={allLocations}
            currentSort={sort}
            currentLocation={location}
            currentMinPrice={filters.min_price}
            currentMaxPrice={filters.max_price}
          />

          {/* Service Grid */}
          {services && services.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className="flex flex-col">
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-16 text-center">
              <p className="text-muted-foreground text-lg">No services found.</p>
              <p className="text-muted-foreground text-sm mt-1">Try adjusting your search.</p>
            </div>
          )}

          {/* Pagination */}
          <CategoryPagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl={baseUrl}
          />

        </div>
      </main>

      <Footer />
    </div>
  );
}

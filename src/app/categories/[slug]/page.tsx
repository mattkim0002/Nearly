import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ServiceCard } from "@/components/services/service-card";
import { CategoryFilterBar } from "@/components/services/category-filter-bar";
import { CategoryPagination } from "@/components/services/category-pagination";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type Service = Database["public"]["Tables"]["services"]["Row"];

const PAGE_SIZE = 12;

type SortOption = "newest" | "price_asc" | "price_desc";

function parseSort(raw: string | undefined): SortOption {
  if (raw === "price_asc" || raw === "price_desc") return raw;
  return "newest";
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
    location?: string;
    min_price?: string;
    max_price?: string;
  }>;
}) {
  const { slug } = await params;
  const filters = await searchParams;

  const supabase = await createClient();

  // Look up category by slug
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single<Category>();

  if (!category) notFound();

  const page = Math.max(1, parseInt(filters.page ?? "1", 10) || 1);
  const sort = parseSort(filters.sort);
  const location = filters.location;
  const minPrice = filters.min_price ? parseInt(filters.min_price, 10) : undefined;
  const maxPrice = filters.max_price ? parseInt(filters.max_price, 10) : undefined;

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // Build filtered query
  let query = supabase
    .from("services")
    .select("*", { count: "exact" })
    .eq("category_id", category.id);

  if (location) {
    query = query.ilike("location", `%${location}%`);
  }
  if (minPrice !== undefined) {
    query = query.gte("price_starting", minPrice);
  }
  if (maxPrice !== undefined) {
    query = query.lte("price_starting", maxPrice);
  }

  // Apply sort
  if (sort === "price_asc") {
    query = query.order("price_starting", { ascending: true });
  } else if (sort === "price_desc") {
    query = query.order("price_starting", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  query = query.range(from, to);

  // Fetch distinct locations for filter bar (for this category)
  const [servicesResult, locationsResult] = await Promise.all([
    query,
    supabase
      .from("services")
      .select("location")
      .eq("category_id", category.id),
  ]);

  const services = servicesResult.data as Service[] | null;
  const count = servicesResult.count;
  const locationRows = locationsResult.data as { location: string }[] | null;

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Deduplicate and sort locations
  const allLocations = Array.from(
    new Set((locationRows ?? []).map((r) => r.location).filter(Boolean))
  ).sort() as string[];

  const baseUrl = `/categories/${slug}?${new URLSearchParams({
    ...(sort !== "newest" && { sort }),
    ...(location && { location }),
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
            <h1 className="text-4xl font-extrabold tracking-tight">{category.name}</h1>
            {category.description && (
              <p className="text-muted-foreground mt-2">{category.description}</p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              {totalCount} {totalCount === 1 ? "service" : "services"}
              {location ? ` in ${location}` : ""}
            </p>
          </div>

          {/* Filter Bar */}
          <CategoryFilterBar
            categorySlug={slug}
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
              <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters.</p>
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
